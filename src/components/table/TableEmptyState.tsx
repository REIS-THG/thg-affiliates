
import { Card } from "@/components/ui/card";
import { FileSpreadsheet } from "lucide-react";

export const TableEmptyState = () => {
  return (
    <Card className="w-full border-[#9C7705]/10">
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="h-12 w-12 rounded-full bg-[#3B751E]/10 flex items-center justify-center mb-4">
          <FileSpreadsheet className="h-6 w-6 text-[#3B751E]" />
        </div>
        <h3 className="text-lg font-medium text-[#3B751E]">No Data Found</h3>
        <p className="text-[#9C7705]/70 mt-2 max-w-md">
          There are no usage records available for this view. Data will appear here once coupon codes are used in purchases.
        </p>
      </div>
    </Card>
  );
};
