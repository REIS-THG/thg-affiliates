
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { fetchCouponUsage, ITEMS_PER_PAGE } from "@/services/DataService";
import { TableLoadingState } from "@/components/table/TableLoadingState";
import { TableErrorState } from "@/components/table/TableErrorState";
import { TableEmptyState } from "@/components/table/TableEmptyState";
import { TableHeader } from "@/components/table/TableHeader";
import { UsageTable } from "@/components/table/UsageTable";
import { TablePagination } from "@/components/table/TablePagination";

interface DataTableProps {
  viewAll?: boolean;
  isTransitioning?: boolean;
}

export const DataTable = ({ viewAll = false, isTransitioning = false }: DataTableProps) => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["couponUsage", currentPage, viewAll, refreshKey],
    queryFn: () => fetchCouponUsage(currentPage, viewAll),
    refetchInterval: 60000, // Refresh data every minute
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error loading data",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    toast({
      title: "Refreshing data",
      description: "Getting the latest usage information",
    });
  };

  const totalPages = data ? Math.ceil(data.count / ITEMS_PER_PAGE) : 0;

  // Show loading state
  if (isLoading || isTransitioning) {
    return <TableLoadingState />;
  }

  // Show error state
  if (error) {
    return <TableErrorState error={error} onRetry={() => refetch()} />;
  }

  // If we have data but it's empty, show empty state
  if (!data || data.data.length === 0) {
    return <TableEmptyState />;
  }

  // Show data table with header and pagination
  return (
    <Card className="w-full border-[#9C7705]/10">
      <TableHeader onRefresh={handleRefresh} />
      <UsageTable data={data.data} />
      <TablePagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Card>
  );
};
