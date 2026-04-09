'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="p-4 rounded-full bg-red-500/10 border border-red-500/30 mb-6">
                <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Something went wrong!</h2>
            <p className="text-gray-400 mb-8 max-w-md">
                {error.message || 'An unexpected error occurred. Our security protocols have caught this exception.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all"
                >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Try again
                </button>
                <Link href="/dashboard">
                    <button className="inline-flex items-center px-6 py-3 bg-gray-800 text-gray-200 font-medium rounded-lg border border-gray-700 hover:bg-gray-700 transition-all">
                        Return to Dashboard
                    </button>
                </Link>
            </div>
        </div>
    );
}
