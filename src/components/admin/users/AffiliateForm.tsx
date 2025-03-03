
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NewAffiliateForm } from "@/components/admin/users/types";

interface AffiliateFormProps {
  newAffiliate: NewAffiliateForm;
  setNewAffiliate: (affiliate: NewAffiliateForm) => void;
  validationErrors: {[key: string]: string};
}

export const AffiliateForm = ({
  newAffiliate,
  setNewAffiliate,
  validationErrors
}: AffiliateFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="coupon" className="text-right">
          Coupon Code*
        </Label>
        <Input
          id="coupon"
          placeholder="EXAMPLE25"
          className={`col-span-3 ${validationErrors.coupon ? 'border-red-500' : ''}`}
          value={newAffiliate.coupon}
          onChange={(e) => setNewAffiliate({...newAffiliate, coupon: e.target.value.toUpperCase()})}
        />
        {validationErrors.coupon && (
          <div className="col-span-3 col-start-2 text-sm text-red-500">{validationErrors.coupon}</div>
        )}
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="affiliate@example.com"
          className={`col-span-3 ${validationErrors.email ? 'border-red-500' : ''}`}
          value={newAffiliate.email}
          onChange={(e) => setNewAffiliate({...newAffiliate, email: e.target.value})}
        />
        {validationErrors.email && (
          <div className="col-span-3 col-start-2 text-sm text-red-500">{validationErrors.email}</div>
        )}
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="password" className="text-right">
          Password*
        </Label>
        <Input
          id="password"
          type="password"
          className={`col-span-3 ${validationErrors.password ? 'border-red-500' : ''}`}
          value={newAffiliate.password}
          onChange={(e) => setNewAffiliate({...newAffiliate, password: e.target.value})}
        />
        {validationErrors.password && (
          <div className="col-span-3 col-start-2 text-sm text-red-500">{validationErrors.password}</div>
        )}
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="confirmPassword" className="text-right">
          Confirm*
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          className={`col-span-3 ${validationErrors.confirmPassword ? 'border-red-500' : ''}`}
          value={newAffiliate.confirmPassword}
          onChange={(e) => setNewAffiliate({...newAffiliate, confirmPassword: e.target.value})}
        />
        {validationErrors.confirmPassword && (
          <div className="col-span-3 col-start-2 text-sm text-red-500">{validationErrors.confirmPassword}</div>
        )}
      </div>
    </div>
  );
};
