
import { DataTable } from "@/components/DataTable";

interface UsageHistoryProps {
  viewAll: boolean;
}

export const UsageHistory = ({ viewAll }: UsageHistoryProps) => {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-[#3B751E]">
        {viewAll ? "All Affiliates" : "Personal"} Usage History
      </h2>
      <DataTable viewAll={viewAll} />
    </section>
  );
};
