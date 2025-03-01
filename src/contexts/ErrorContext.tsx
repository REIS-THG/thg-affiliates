
import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

interface ErrorContextType {
  setGlobalError: (error: Error | null) => void;
  handleApiError: (error: unknown, fallbackMessage?: string) => void;
  clearErrors: () => void;
  error: Error | null;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<Error | null>(null);

  const setGlobalError = (error: Error | null) => {
    setError(error);
    if (error) {
      console.error("Global error:", error);
    }
  };

  const handleApiError = (error: unknown, fallbackMessage = "An unexpected error occurred") => {
    console.error("API error:", error);
    
    let errorMessage = fallbackMessage;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = String((error as any).message);
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    toast.error("Error", { description: errorMessage });
    setError(error instanceof Error ? error : new Error(errorMessage));
  };

  const clearErrors = () => {
    setError(null);
  };

  return (
    <ErrorContext.Provider value={{ error, setGlobalError, handleApiError, clearErrors }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useErrorContext() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error("useErrorContext must be used within an ErrorProvider");
  }
  return context;
}
