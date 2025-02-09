
import { DataTable } from "@/components/DataTable";

interface UsageHistoryProps {
  viewAll: boolean;
}

export const UsageHistory = ({ viewAll }: UsageHistoryProps) => {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">
        {viewAll ? "All Affiliates" : "Personal"} Usage History
      </h2>
      <DataTable />
    </section>
  );
};
