
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

// Mock data
const mockData: CouponUsage[] = [
  { date: "2024-02-20", product_name: "Premium Course Bundle", quantity: 3, earnings: 147.00 },
  { date: "2024-02-19", product_name: "Digital Marketing Workshop", quantity: 2, earnings: 98.00 },
  { date: "2024-02-18", product_name: "SEO Masterclass", quantity: 5, earnings: 245.00 },
  { date: "2024-02-17", product_name: "Social Media Strategy Course", quantity: 1, earnings: 49.00 },
  { date: "2024-02-16", product_name: "Content Creation Basics", quantity: 4, earnings: 196.00 },
  { date: "2024-02-15", product_name: "Email Marketing Guide", quantity: 2, earnings: 98.00 },
  { date: "2024-02-14", product_name: "Affiliate Marketing 101", quantity: 3, earnings: 147.00 },
  { date: "2024-02-13", product_name: "Business Analytics Course", quantity: 1, earnings: 49.00 },
  { date: "2024-02-12", product_name: "WordPress Development", quantity: 2, earnings: 98.00 },
  { date: "2024-02-11", product_name: "UI/UX Design Fundamentals", quantity: 3, earnings: 147.00 },
  { date: "2024-02-10", product_name: "JavaScript Bootcamp", quantity: 4, earnings: 196.00 },
  { date: "2024-02-09", product_name: "Python for Beginners", quantity: 2, earnings: 98.00 },
  { date: "2024-02-08", product_name: "Data Science Essentials", quantity: 1, earnings: 49.00 },
  { date: "2024-02-07", product_name: "Mobile App Development", quantity: 3, earnings: 147.00 },
  { date: "2024-02-06", product_name: "Cloud Computing Basics", quantity: 2, earnings: 98.00 }
];

const fetchCouponUsage = async (page: number): Promise<{ data: CouponUsage[], count: number }> => {
  // Using mock data instead of Supabase
  const startIndex = page * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = mockData.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    count: mockData.length
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
