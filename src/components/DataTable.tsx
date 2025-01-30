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

interface CouponData {
  date: string;
  quantity: number;
}

const fetchCouponData = async (): Promise<CouponData[]> => {
  // TODO: Implement Square API integration
  // This is mock data for now
  return [
    { date: "2024-01", quantity: 65 },
    { date: "2024-02", quantity: 85 },
    { date: "2024-03", quantity: 120 },
    { date: "2024-04", quantity: 90 },
  ];
};

export const DataTable = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["couponData"],
    queryFn: fetchCouponData,
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
        <p className="text-destructive">Error loading data</p>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Quantity Used</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((row) => (
            <TableRow key={row.date}>
              <TableCell>{row.date}</TableCell>
              <TableCell className="text-right">{row.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};