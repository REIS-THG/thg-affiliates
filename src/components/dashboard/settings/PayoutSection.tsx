
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PayoutSectionProps {
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  paymentDetails: string;
  setPaymentDetails: (value: string) => void;
}

export const PayoutSection = ({
  paymentMethod,
  setPaymentMethod,
  paymentDetails,
  setPaymentDetails,
}: PayoutSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Payout Information</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Payment Method</Label>
          <Select
            value={paymentMethod}
            onValueChange={setPaymentMethod}
          >
            <SelectTrigger className="bg-background/95">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent className="bg-background/95">
              <SelectItem value="venmo">Venmo</SelectItem>
              <SelectItem value="cashapp">Cashapp</SelectItem>
              <SelectItem value="ach">Account Number (ACH)</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Payment Details</Label>
          <Input
            value={paymentDetails}
            onChange={(e) => setPaymentDetails(e.target.value)}
            placeholder="Enter your payment details"
          />
        </div>
      </div>
    </div>
  );
};
