import { NextRequest, NextResponse } from 'next/server';
import { runOrchestrator } from '@/lib/orchestrator';
import { supabaseServiceRole } from '@/lib/supabase';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { prepareProjectFromStorage, cleanupProjectDir } from '@/lib/project-utils';

export async function POST(request: NextRequest) {
  let projectDir: string | null = null;

  try {
    // Authenticate user
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { projectId } = body;

    // Validate input
    if (!projectId) {
      return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }

    const supabase = supabaseServiceRole();

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ success: false, error: 'Project not found or access denied' }, { status: 404 });
    }

    // Prepare project from storage
    const storagePath = `projects/${projectId}/source.zip`;
    try {
      projectDir = await prepareProjectFromStorage(projectId, storagePath);
    } catch (error: any) {
      // Try generated code if source doesn't exist
      const generatedPath = `projects/${projectId}/generated.zip`;
      try {
        projectDir = await prepareProjectFromStorage(projectId, generatedPath);
      } catch (genError: any) {
        return NextResponse.json({ 
          success: false, 
          error: `Failed to load project: ${error.message}` 
        }, { status: 500 });
      }
    }

    // Run the orchestrator
    const result = await runOrchestrator(projectDir);

    // Validate orchestrator result
    if (!result || !result.findings || !result.patches) {
      return NextResponse.json({ success: false, error: 'Invalid orchestrator result' }, { status: 500 });
    }

    // Count severities
    const severityCounts = {
      high: result.findings.filter(f => f.severity === 'high').length,
      medium: result.findings.filter(f => f.severity === 'medium').length,
      low: result.findings.filter(f => f.severity === 'low').length
    };

    // Create scan record
    const { data: scan, error: scanError } = await supabase
      .from('scans')
      .insert([
        {
          project_id: projectId,
          severity_counts: severityCounts
        }
      ])
      .select()
      .single();

    if (scanError) {
      console.error('Error creating scan:', scanError);
      return NextResponse.json({ success: false, error: 'Failed to create scan record' }, { status: 500 });
    }

    // Store vulnerabilities
    let vulnerabilityIds: Record<string, string> = {};
    if (scan && result.findings.length > 0) {
      const vulnerabilities = result.findings.map(finding => ({
        scan_id: scan.id,
        severity: finding.severity,
        file_path: finding.file,
        line_number: finding.line,
        description: finding.type,
        code_snippet: finding.snippet
      }));

      const { data: insertedVulns, error: vulnError } = await supabase
        .from('vulnerabilities')
        .insert(vulnerabilities)
        .select('id, file_path, line_number');

      if (vulnError) {
        console.error('Error storing vulnerabilities:', vulnError);
        return NextResponse.json({ success: false, error: 'Failed to store vulnerabilities' }, { status: 500 });
      }

      // Create a map for patch association
      if (insertedVulns) {
        insertedVulns.forEach(vuln => {
          const key = `${vuln.file_path}:${vuln.line_number}`;
          vulnerabilityIds[key] = vuln.id;
        });
      }
    }

    // Store patches
    if (scan && result.patches.length > 0) {
      const patches = result.patches.map(patch => {
        const matchingKey = Object.keys(vulnerabilityIds).find(key => 
          key.startsWith(patch.file + ':')
        );
        
        return {
          scan_id: scan.id,
          vulnerability_id: matchingKey ? vulnerabilityIds[matchingKey] : null,
          before_code: patch.before || null,
          after_code: patch.after || null
        };
      }).filter(p => p.vulnerability_id);

      if (patches.length > 0) {
        const { error: patchError } = await supabase
          .from('patches')
          .insert(patches);

        if (patchError) {
          console.error('Error storing patches:', patchError);
        }
      }
    }

    // Log timeline event
    await supabase
      .from('timeline_events')
      .insert([
        {
          project_id: projectId,
          event_type: 'scan_complete',
          event_message: `Scan completed with ${result.findings.length} findings`
        }
      ]);

    return NextResponse.json({
      success: true,
      findings: result.findings,
      patches: result.patches,
      scanId: scan?.id
    });
  } catch (error: any) {
    console.error('Scan error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  } finally {
    if (projectDir) {
      await cleanupProjectDir(projectDir);
    }
  }
}
