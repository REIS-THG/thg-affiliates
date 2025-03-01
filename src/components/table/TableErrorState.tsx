
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

interface TableErrorStateProps {
  error: Error | unknown;
  onRetry: () => void;
}

export const TableErrorState = ({ error, onRetry }: TableErrorStateProps) => {
  return (
    <Card className="w-full p-4 border-[#9C7705]/10">
      <p className="text-red-600">
        Error loading data: {error instanceof Error ? error.message : 'Unknown error'}
      </p>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRetry} 
        className="mt-4 text-[#3B751E]"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    </Card>
  );
};
