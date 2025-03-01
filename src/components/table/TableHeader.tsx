
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface TableHeaderProps {
  onRefresh: () => void;
}

export const TableHeader = ({ onRefresh }: TableHeaderProps) => {
  return (
    <div className="flex justify-end p-4 border-b border-[#9C7705]/10">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh}
        className="text-[#3B751E] border-[#3B751E]/30 hover:bg-[#3B751E]/10"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh Data
      </Button>
    </div>
  );
};
