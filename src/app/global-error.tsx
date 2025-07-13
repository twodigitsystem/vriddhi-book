'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html>
      <body className="bg-background">
        <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
          <div className="mx-auto max-w-md space-y-6">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
              <p className="text-muted-foreground">
                We're sorry, but we encountered a critical error that we couldn't recover from.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
              >
                Go to Homepage
              </Button>
              <Button onClick={() => reset()}>
                Try Again
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 rounded-lg border p-4 text-left text-sm">
                <summary className="cursor-pointer font-medium">Error Details</summary>
                <div className="mt-2 overflow-auto rounded bg-muted/50 p-3 font-mono text-xs">
                  <div className="whitespace-pre-wrap">
                    {error.stack || error.toString()}
                  </div>
                  {error.digest && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <span className="font-semibold">Digest:</span> {error.digest}
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
