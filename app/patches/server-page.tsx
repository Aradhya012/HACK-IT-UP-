import { createSupabaseServerClient } from '@/lib/supabase-server';
import { Download, FileCode, Clock } from 'lucide-react';
import Link from 'next/link';

// Server component - fetches data directly from Supabase
export default async function PatchesServerPage({ searchParams }: { searchParams: { scanId?: string } }) {
  const scanId = searchParams.scanId;

  if (!scanId) {
    return (
      <div className="max-w-7xl mx-auto py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Patches Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please select a scan to view patches.
          </p>
          <Link href="/dashboard">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Initialize Supabase client
  const supabase = await createSupabaseServerClient();

  // Fetch patches for this scan
  const { data: patches, error: patchError } = await supabase
    .from('patches')
    .select(`
      *,
      vulnerabilities(severity, file_path, line_number, description)
    `)
    .eq('scan_id', scanId)
    .order('created_at', { ascending: true });

  if (patchError) {
    console.error('Error fetching patches:', patchError);
    return (
      <div className="max-w-7xl mx-auto py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Error Loading Patches</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            There was an error loading the patches. Please try again later.
          </p>
          <Link href="/dashboard">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Fetch scan details
  const { data: scan, error: scanError } = await supabase
    .from('scans')
    .select(`
      *,
      projects(name)
    `)
    .eq('id', scanId)
    .single();

  if (scanError || !scan) {
    console.error('Error fetching scan:', scanError);
  }

  const handleExport = async () => {
    'use server';
    // This would be implemented in a real application
    // console.log('Export functionality would be implemented here');
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Applied Patches
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Review the auto-generated security patches applied to your codebase
            </p>
            {scan?.projects && (
              <p className="text-gray-500 dark:text-gray-500 mt-1">
                Project: {scan.projects.name}
              </p>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExport}
              className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Download className="mr-2 h-4 w-4" />
              Export All
            </button>
          </div>
        </div>
      </div>

      {patches && patches.length > 0 ? (
        <div className="space-y-6">
          {patches.map((patch, index) => (
            <div key={patch.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Patch #{index + 1}
                  </h3>
                  <div className="flex items-center space-x-4">
                    {patch.vulnerabilities && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${patch.vulnerabilities.severity === 'high'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                          : patch.vulnerabilities.severity === 'medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
                        }`}>
                        {patch.vulnerabilities.severity} severity
                      </span>
                    )}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(patch.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                {patch.vulnerabilities && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {patch.vulnerabilities.description} in {patch.vulnerabilities.file_path}:{patch.vulnerabilities.line_number}
                  </p>
                )}
              </div>

              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Before Code */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                      <FileCode className="mr-2 h-4 w-4 text-red-500" />
                      Before (Vulnerable Code)
                    </h4>
                    <pre className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 text-sm overflow-x-auto max-h-64">
                      <code>{patch.before_code || '// No before code available'}</code>
                    </pre>
                  </div>

                  {/* After Code */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                      <FileCode className="mr-2 h-4 w-4 text-green-500" />
                      After (Patched Code)
                    </h4>
                    <pre className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 text-sm overflow-x-auto max-h-64">
                      <code>{patch.after_code || '// No after code available'}</code>
                    </pre>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
                    View in Context
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center border border-gray-200 dark:border-gray-700">
          <Clock className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">No Patches Available</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            No auto-generated patches were created for this scan.
          </p>
          <div className="mt-6">
            <Link href="/dashboard">
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}