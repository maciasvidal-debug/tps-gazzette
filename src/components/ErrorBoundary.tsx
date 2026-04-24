import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    // Clear the specific local storage key for the app state
    localStorage.removeItem('gazzette-editor-state');
    // Reload the page to reset the React tree
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#2C2D35] p-6 text-[#E5E7EB] font-sans">
          <div className="max-w-md w-full bg-[#212126] border border-[#ED6A5E] shadow-2xl rounded-lg overflow-hidden">
            <div className="bg-[#ED6A5E] px-6 py-4 flex items-center gap-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-white font-bold tracking-wider uppercase text-lg">System Error</h2>
            </div>

            <div className="p-6">
              <p className="mb-4 text-[#8B8D98] text-sm">
                The Layout Editor encountered an unexpected critical error. This can sometimes happen if the saved workspace state becomes corrupted.
              </p>

              <div className="bg-[#1A1A1E] p-3 rounded border border-[#343541] mb-6 overflow-x-auto">
                <code className="text-xs text-[#ED6A5E] font-mono">
                  {this.state.error?.message || 'Unknown render error'}
                </code>
              </div>

              <button
                onClick={this.handleReset}
                className="w-full bg-[#E5E7EB] hover:bg-white text-[#212126] font-bold py-3 px-4 rounded transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Workspace & Recover
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
