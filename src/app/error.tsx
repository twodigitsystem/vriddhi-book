'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Route Error:', error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center gap-6 p-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
        <p className="text-muted-foreground">
          {error.message || 'We encountered an unexpected error. Please try again.'}
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
        <Button onClick={() => reset()}>Try Again</Button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 max-w-lg rounded-lg border p-4 text-left text-sm">
          <summary className="cursor-pointer font-medium">Error Details</summary>
          <div className="mt-2 overflow-auto rounded bg-muted/50 p-2 font-mono text-xs">
            {error.stack || error.toString()}
          </div>
        </details>
      )}
    </div>
  );
}
