
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
  product_name: string;
  quantity: number;
  earnings: number;
}

const fetchCouponUsage = async (): Promise<CouponUsage[]> => {
  const user = JSON.parse(localStorage.getItem('affiliateUser') || '{}');
  
  if (!user.coupon_code) {
    throw new Error('User not authenticated');
  }

  console.log('Fetching coupon usage for:', user.coupon_code);
  
  // Mock data for demonstration
  return [
    { date: '2024-03-15', product_name: 'Premium Monthly Plan', quantity: 5, earnings: 250.00 },
    { date: '2024-03-14', product_name: 'Annual Subscription', quantity: 3, earnings: 150.00 },
    { date: '2024-03-13', product_name: 'Business Package', quantity: 7, earnings: 350.00 },
    { date: '2024-03-12', product_name: 'Premium Monthly Plan', quantity: 4, earnings: 200.00 },
    { date: '2024-03-11', product_name: 'Annual Subscription', quantity: 6, earnings: 300.00 },
    { date: '2024-03-10', product_name: 'Business Package', quantity: 8, earnings: 400.00 },
    { date: '2024-03-09', product_name: 'Premium Monthly Plan', quantity: 2, earnings: 100.00 },
    { date: '2024-03-08', product_name: 'Annual Subscription', quantity: 5, earnings: 250.00 },
    { date: '2024-03-07', product_name: 'Business Package', quantity: 3, earnings: 150.00 },
    { date: '2024-03-06', product_name: 'Premium Monthly Plan', quantity: 4, earnings: 200.00 },
  ];
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
            <TableHead>Product Name</TableHead>
            <TableHead>Purchase Date</TableHead>
            <TableHead className="text-right">Qty Purchased</TableHead>
            <TableHead className="text-right">Earnings/Purchase</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.product_name}</TableCell>
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
