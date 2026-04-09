import { createSupabaseServerClient } from '@/lib/supabase-server';
import { 
  Clock, 
  FileText, 
  Shield, 
  Zap, 
  Download, 
  Wrench 
} from 'lucide-react';
import Link from 'next/link';

// Server component - fetches data directly from Supabase
export default async function TimelineServerPage({ searchParams }: { searchParams: { projectId?: string } }) {
  const projectId = searchParams.projectId;
  
  if (!projectId) {
    return (
      <div className="max-w-7xl mx-auto py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Timeline Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please select a project to view its timeline.
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
  
  // Fetch timeline events for this project
  const { data: events, error: eventsError } = await supabase
    .from('timeline_events')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  if (eventsError) {
    console.error('Error fetching timeline events:', eventsError);
    return (
      <div className="max-w-7xl mx-auto py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Error Loading Timeline</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            There was an error loading the timeline. Please try again later.
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
  
  // Fetch project details
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('name')
    .eq('id', projectId)
    .single();
  
  if (projectError || !project) {
    console.error('Error fetching project:', projectError);
  }
  
  // Map event types to icons and colors
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'upload':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'scan_complete':
        return <Shield className="h-5 w-5 text-cyan-500" />;
      case 'patch_apply':
        return <Zap className="h-5 w-5 text-yellow-500" />;
      case 'export':
        return <Download className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'upload':
        return 'bg-green-500';
      case 'scan_complete':
        return 'bg-cyan-500';
      case 'patch_apply':
        return 'bg-yellow-500';
      case 'export':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Security Timeline
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Track all security events and activities for your project
            </p>
            {project && (
              <p className="text-gray-500 dark:text-gray-500 mt-1">
                Project: {project.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {events && events.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Activity Feed</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              All security-related events for this project
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="flow-root">
              <ul className="space-y-6">
                {events.map((event, index) => (
                  <li key={event.id} className="relative pl-8">
                    {/* Vertical line */}
                    {index !== events.length - 1 && (
                      <div className="absolute left-4 top-6 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                    )}
                    
                    {/* Icon */}
                    <div className={`absolute left-2 top-2 h-4 w-4 rounded-full ${getEventColor(event.event_type)} flex items-center justify-center`}>
                      {getEventIcon(event.event_type)}
                    </div>
                    
                    {/* Content */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {event.event_message}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(event.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">
                          {event.event_type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center border border-gray-200 dark:border-gray-700">
          <Clock className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">No Activity Yet</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            No security events have been recorded for this project.
          </p>
          <div className="mt-6">
            <Link href="/upload">
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">
                Upload Codebase
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}