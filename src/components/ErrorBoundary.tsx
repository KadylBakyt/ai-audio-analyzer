import * as React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Top-level error boundary that keeps the whole app from crashing to a blank
 * screen. Deliberately framework-text only (i18n may itself have failed).
 */
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Uncaught error:', error, info);
  }

  private handleReload = () => window.location.reload();

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <AlertOctagon className="size-7" />
        </span>
        <div>
          <h1 className="text-lg font-semibold">Something went wrong</h1>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </p>
        </div>
        <button
          onClick={this.handleReload}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          <RefreshCw className="size-4" />
          Reload
        </button>
      </div>
    );
  }
}
