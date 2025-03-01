
import { Component, ErrorInfo, ReactNode } from "react";
import ErrorBoundary from "./ErrorBoundary";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Global error caught:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9F7F0] p-4">
          <div className="max-w-md w-full">
            <Alert variant="destructive" className="border-red-300 bg-red-50">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle className="text-red-800">Application Error</AlertTitle>
              <AlertDescription className="text-red-700 mt-2">
                <p className="mb-4">The application has encountered an unexpected error. Please try refreshing the page.</p>
                <p className="text-sm font-mono bg-red-100 p-3 rounded-md overflow-auto max-h-32">
                  {this.state.error?.message || "Unknown error"}
                </p>
                <div className="mt-4 flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={this.handleReset}
                    className="bg-white text-red-700 border-red-300 hover:bg-red-50"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <Button 
                    onClick={() => window.location.reload()}
                    className="bg-red-700 hover:bg-red-800 text-white"
                  >
                    Refresh Page
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

    // Use the component-level ErrorBoundary as well for more granular error handling
    return (
      <ErrorBoundary>
        {this.props.children}
      </ErrorBoundary>
    );
  }
}
