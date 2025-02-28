
import { DataTable } from "@/components/DataTable";
import { Card } from "@/components/ui/card";

interface UsageHistoryProps {
  viewAll: boolean;
}

export const UsageHistory = ({ viewAll }: UsageHistoryProps) => {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-[#3B751E]">
        {viewAll ? "All Affiliates" : "Personal"} Usage History
      </h2>
      <Card className="bg-[#F9F7F0]/50 p-4">
        <DataTable viewAll={viewAll} />
      </Card>
    </section>
  );
};
