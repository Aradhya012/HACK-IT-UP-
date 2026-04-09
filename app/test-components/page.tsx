'use client';

import { VulnerabilityCard } from '@/components/VulnerabilityCard';
import { VulnerabilityTable } from '@/components/VulnerabilityTable';
import { Timeline } from '@/components/Timeline';
import { PatchDiff } from '@/components/PatchDiff';
import { 
  AlertTriangle, 
  CheckCircle,
  ShieldAlert,
  Clock
} from 'lucide-react';

export default function TestComponentsPage() {
  // Mock data for testing
  const mockFindings: any[] = [
    {
      type: 'SQL Injection',
      severity: 'high' as const,
      file: 'src/database/query.js',
      line: 42,
      snippet: 'const query = "SELECT * FROM users WHERE id = " + userId;'
    },
    {
      type: 'XSS Vulnerability',
      severity: 'medium' as const,
      file: 'src/components/UserProfile.jsx',
      line: 15,
      snippet: 'document.innerHTML = userInput;'
    }
  ];

  const mockPatches: any[] = [
    {
      file: 'src/database/query.js',
      change: 'Parameterized SQL query implementation',
      before: 'const query = "SELECT * FROM users WHERE id = " + userId;',
      after: 'const query = "SELECT * FROM users WHERE id = ?";'
    }
  ];

  const mockEvents: any[] = [
    {
      id: 1,
      date: '2023-06-15T10:30:00Z',
      title: 'Security Scan Completed',
      description: 'Scanned repository github.com/example/project',
      status: 'completed' as const,
      severity: 'high' as const,
      findings: 12,
      patches: 8
    }
  ];

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Component Tests</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Vulnerability Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <VulnerabilityCard 
              title="Critical Issues" 
              count={5} 
              severity="high" 
              icon={<AlertTriangle className="h-6 w-6" />} 
            />
            <VulnerabilityCard 
              title="Medium Issues" 
              count={12} 
              severity="medium" 
              icon={<AlertTriangle className="h-6 w-6" />} 
            />
            <VulnerabilityCard 
              title="Low Issues" 
              count={8} 
              severity="low" 
              icon={<AlertTriangle className="h-6 w-6" />} 
            />
            <VulnerabilityCard 
              title="Auto-Patches" 
              count={15} 
              severity="patch" 
              icon={<CheckCircle className="h-6 w-6" />} 
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Vulnerability Table</h2>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <VulnerabilityTable findings={mockFindings} patches={mockPatches} />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Timeline</h2>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <Timeline events={mockEvents} />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Patch Diff Viewer</h2>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <PatchDiff 
              before="// Vulnerable code
const userId = req.query.id;
const query = 'SELECT * FROM users WHERE id = ' + userId;
db.query(query);"
              after="// Secured code
const userId = req.query.id;
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}