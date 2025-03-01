
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface CouponUsage {
  date: string;
  product_name: string;
  quantity: number;
  earnings: number;
  order_status: 'pending' | 'processing' | 'completed' | 'cancelled';
  payout_date: string | null;
  code: string;
}

interface UsageTableProps {
  data: CouponUsage[];
  viewAll?: boolean;
}

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

export const UsageTable = ({ data, viewAll = false }: UsageTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table aria-label="Coupon usage data">
        <TableHeader className="bg-[#3B751E]/10">
          <TableRow>
            <TableHead className="text-[#3B751E] font-medium">Product Name</TableHead>
            <TableHead className="text-[#3B751E] font-medium">Purchase Date</TableHead>
            <TableHead className="text-[#3B751E] font-medium">Status</TableHead>
            <TableHead className="text-[#3B751E] font-medium">Payout Date</TableHead>
            <TableHead className="text-[#3B751E] font-medium text-right">Qty</TableHead>
            {!viewAll && (
              <TableHead className="text-[#3B751E] font-medium text-right">Earnings</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
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
              {!viewAll && (
                <TableCell className="text-right font-semibold text-[#3B751E]">${row.earnings.toFixed(2)}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
