
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

interface CouponUsage {
  date: string;
  code: string;
  quantity: number;
  earnings: number;
}

const fetchCouponUsage = async (): Promise<CouponUsage[]> => {
  const user = JSON.parse(localStorage.getItem('affiliateUser') || '{}');
  
  if (!user.coupon_code) {
    throw new Error('User not authenticated');
  }

  console.log('Fetching coupon usage for:', user.coupon_code);
  
  const { data, error } = await supabase
    .from('coupon_usage')
    .select('*')
    .eq('code', user.coupon_code)
    .order('date', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching coupon usage:', error);
    throw error;
  }

  return data || [];
};

export const DataTable = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["couponUsage"],
    queryFn: fetchCouponUsage,
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <Card className="w-full relative overflow-hidden">
        <div className="animate-pulse space-y-4 p-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 bg-gray-200 rounded" />
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
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Earnings</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((row) => (
            <TableRow key={row.date}>
              <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">{row.quantity}</TableCell>
              <TableCell className="text-right">${row.earnings.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
