
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
import { generateMockTableData } from "@/utils/mockDataGenerator";
import { Badge } from "@/components/ui/badge";

interface DataTableProps {
  viewAll?: boolean;
}

interface CouponUsage {
  date: string;
  product_name: string;
  quantity: number;
  earnings: number;
  order_status: 'pending' | 'processing' | 'completed' | 'cancelled';
  payout_date: string | null;
}

const ITEMS_PER_PAGE = 10;

const fetchCouponUsage = async (page: number, viewAll: boolean): Promise<{ data: CouponUsage[], count: number }> => {
  try {
    const userStr = localStorage.getItem('affiliateUser');
    if (!userStr) throw new Error('No user data found');
    
    const user = JSON.parse(userStr);
    
    // For demo purposes, using mock data
    // In production, this would be a real Supabase query
    const mockData = generateMockTableData(30);
    const startIndex = page * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    // Filter data based on viewAll parameter
    const filteredData = viewAll ? mockData : mockData.filter(row => 
      // In production, this would filter based on the user's coupon code
      Math.random() > 0.5 // Simulating filtering for demo
    );
    
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      count: filteredData.length
    };
  } catch (error) {
    console.error('Error fetching coupon usage:', error);
    throw error;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500/20 text-green-700';
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-700';
    case 'processing':
      return 'bg-blue-500/20 text-blue-700';
    case 'cancelled':
      return 'bg-red-500/20 text-red-700';
    default:
      return 'bg-gray-500/20 text-gray-700';
  }
};

export const DataTable = ({ viewAll = false }: DataTableProps) => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["couponUsage", currentPage, viewAll],
    queryFn: () => fetchCouponUsage(currentPage, viewAll),
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
            <TableHead>Status</TableHead>
            <TableHead>Payout Date</TableHead>
            <TableHead className="text-right">Qty Purchased</TableHead>
            <TableHead className="text-right">Earnings/Purchase</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{row.product_name}</TableCell>
              <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge className={cn("capitalize", getStatusColor(row.order_status))}>
                  {row.order_status}
                </Badge>
              </TableCell>
              <TableCell>
                {row.payout_date ? new Date(row.payout_date).toLocaleDateString() : 'Pending'}
              </TableCell>
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
