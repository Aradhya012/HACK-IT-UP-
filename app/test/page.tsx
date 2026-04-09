'use client';

import { CardSkeleton, TableSkeleton, TimelineSkeleton } from '@/components/LoadingSkeletons';

export default function TestPage() {
  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Component Tests</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Card Skeleton</h2>
          <CardSkeleton />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Table Skeleton</h2>
          <TableSkeleton />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Timeline Skeleton</h2>
          <TimelineSkeleton />
        </div>
      </div>
    </div>
  );
}