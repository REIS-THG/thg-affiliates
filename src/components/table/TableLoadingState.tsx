
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";

export const TableLoadingState = () => {
  return (
    <Card className="w-full relative overflow-hidden border-[#9C7705]/10">
      <div className="flex justify-end p-4 border-b border-[#9C7705]/10">
        <Button 
          variant="outline" 
          size="sm" 
          disabled
          className="text-[#9C7705]/70"
        >
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          Loading
        </Button>
      </div>
      <div className="space-y-4 p-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-12 w-full bg-[#9C7705]/10" />
          </div>
        ))}
      </div>
    </Card>
  );
};
