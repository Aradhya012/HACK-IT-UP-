'use client';

import { Loader2 } from 'lucide-react';

export default function Loader() {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-6 w-6 text-cyber-cyan animate-spin" />
    </div>
  );
}