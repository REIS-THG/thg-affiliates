
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CouponUsage {
  date: string;
  product_name: string;
  quantity: number;
  earnings: number;
}

const ITEMS_PER_PAGE = 10;

const fetchCouponUsage = async (page: number): Promise<{ data: CouponUsage[], count: number }> => {
  const user = JSON.parse(localStorage.getItem('affiliateUser') || '{}');
  
  if (!user.coupon_code) {
    throw new Error('User not authenticated');
  }

  console.log('Fetching coupon usage for:', user.coupon_code);
  
  // Get total count
  const { count } = await supabase
    .from('coupon_usage')
    .select('*', { count: 'exact', head: true })
    .eq('coupon_code', user.coupon_code);

  // Get paginated data
  const { data, error } = await supabase
    .from('coupon_usage')
    .select('*')
    .eq('coupon_code', user.coupon_code)
    .order('date', { ascending: false })
    .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }

  return { 
    data: data as CouponUsage[], 
    count: count || 0 
  };
};

export const DataTable = () => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(0);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["couponUsage", currentPage],
    queryFn: () => fetchCouponUsage(currentPage),
    refetchInterval: 30000,
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

  const totalPages = data ? Math.ceil(data.count / ITEMS_PER_PAGE) : 0;

  if (isLoading) {
    return (
      <Card className="w-full relative overflow-hidden">
        <div className="space-y-4 p-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full p-4">
        <p className="text-destructive">Error loading data: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Purchase Date</TableHead>
            <TableHead className="text-right">Qty Purchased</TableHead>
            <TableHead className="text-right">Earnings/Purchase</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.product_name}</TableCell>
              <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">{row.quantity}</TableCell>
              <TableCell className="text-right">${row.earnings.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <div className="py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 0 && setCurrentPage(p => p - 1)}
                  className={cn(currentPage === 0 && "pointer-events-none opacity-50")}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i)}
                    isActive={currentPage === i}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages - 1 && setCurrentPage(p => p + 1)}
                  className={cn(currentPage === totalPages - 1 && "pointer-events-none opacity-50")}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </Card>
  );
};
