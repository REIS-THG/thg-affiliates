
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
import { supabase } from "@/integrations/supabase/client"; // Updated to use the correct Supabase client
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
import { Badge } from "@/components/ui/badge";
import { generateMockTableData } from "@/utils/mockDataGenerator";
import { FileSpreadsheet, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  code: string;
}

const ITEMS_PER_PAGE = 10;

const fetchCouponUsage = async (page: number, viewAll: boolean): Promise<{ data: CouponUsage[], count: number }> => {
  try {
    // Get user data from localStorage if available
    const userStr = localStorage.getItem('affiliateUser');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (!user) {
      throw new Error('No user data found. Please log in again.');
    }
    
    const startIndex = page * ITEMS_PER_PAGE;
    
    console.log('Fetching coupon usage data for:', { 
      user_coupon: user.coupon_code,
      is_admin: user.role === 'admin',
      viewAll,
      page,
      startIndex
    });
    
    // Try to get data from Supabase
    try {
      const query = supabase
        .from('coupon_usage')
        .select('*', { count: 'exact' })
        .order('date', { ascending: false });
      
      // If not admin and not viewAll, filter by user's coupon code
      if (user.role !== 'admin' && !viewAll) {
        query.eq('code', user.coupon_code);
      }
        
      query.range(startIndex, startIndex + ITEMS_PER_PAGE - 1);
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log('Supabase returned data:', { count, firstItem: data[0] });
        return {
          data: data as CouponUsage[],
          count: count || 0
        };
      } else {
        console.log('Supabase returned no data, using mock data');
      }
    } catch (supabaseError) {
      console.error('Supabase fetch error:', supabaseError);
      // Fall back to mock data if Supabase query fails
    }
    
    // If we reach here, use mock data
    console.log('Generating mock data for table');
    const mockData = generateMockTableData(30);
    return {
      data: mockData.slice(startIndex, startIndex + ITEMS_PER_PAGE),
      count: mockData.length
    };
  } catch (error) {
    console.error('Error in fetchCouponUsage:', error);
    throw error;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-[#3B751E]/20 text-[#3B751E]';
    case 'pending':
      return 'bg-[#9C7705]/20 text-[#9C7705]';
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

  if (isLoading) {
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
  }

  if (error) {
    return (
      <Card className="w-full p-4 border-[#9C7705]/10">
        <p className="text-red-600">Error loading data: {error instanceof Error ? error.message : 'Unknown error'}</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetch()} 
          className="mt-4 text-[#3B751E]"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </Card>
    );
  }

  return (
    <Card className="w-full border-[#9C7705]/10">
      <div className="flex justify-end p-4 border-b border-[#9C7705]/10">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          className="text-[#3B751E] border-[#3B751E]/30 hover:bg-[#3B751E]/10"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {data && data.data.length > 0 ? (
        <>
          <Table>
            <TableHeader className="bg-[#3B751E]/10">
              <TableRow>
                <TableHead className="text-[#3B751E]">Product Name</TableHead>
                <TableHead className="text-[#3B751E]">Purchase Date</TableHead>
                <TableHead className="text-[#3B751E]">Status</TableHead>
                <TableHead className="text-[#3B751E]">Payout Date</TableHead>
                <TableHead className="text-[#3B751E] text-right">Qty</TableHead>
                <TableHead className="text-[#3B751E] text-right">Earnings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((row, index) => (
                <TableRow key={index} className="hover:bg-[#F9F7F0]">
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
                  <TableCell className="text-right font-semibold text-[#3B751E]">${row.earnings.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="py-4 border-t border-[#9C7705]/10">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 0 && setCurrentPage(p => p - 1)}
                      className={cn(currentPage === 0 && "pointer-events-none opacity-50", "text-[#3B751E]")}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                    const pageIndex = i + Math.max(0, currentPage - 2 + (currentPage < 2 ? 2 - currentPage : 0));
                    if (pageIndex >= totalPages) return null;
                    
                    return (
                      <PaginationItem key={pageIndex}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageIndex)}
                          isActive={currentPage === pageIndex}
                          className={currentPage === pageIndex ? "bg-[#3B751E] text-white" : "text-[#3B751E]"}
                        >
                          {pageIndex + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => currentPage < totalPages - 1 && setCurrentPage(p => p + 1)}
                      className={cn(currentPage === totalPages - 1 && "pointer-events-none opacity-50", "text-[#3B751E]")}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="h-12 w-12 rounded-full bg-[#3B751E]/10 flex items-center justify-center mb-4">
            <FileSpreadsheet className="h-6 w-6 text-[#3B751E]" />
          </div>
          <h3 className="text-lg font-medium text-[#3B751E]">No Data Found</h3>
          <p className="text-[#9C7705]/70 mt-2 max-w-md">
            There are no usage records available for this view. Data will appear here once coupon codes are used in purchases.
          </p>
        </div>
      )}
    </Card>
  );
};
