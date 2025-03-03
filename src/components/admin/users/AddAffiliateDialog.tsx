
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Plus } from "lucide-react";
import { NewAffiliateForm } from "@/components/admin/users/types";
import * as bcrypt from 'bcryptjs';

interface AddAffiliateDialogProps {
  onAffilateAdded: () => void;
}

export const AddAffiliateDialog = ({ onAffilateAdded }: AddAffiliateDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newAffiliate, setNewAffiliate] = useState<NewAffiliateForm>({
    coupon: "",
    email: "",
    password: "",
    confirmPassword: "",
    payment_method: "",
    payment_details: "",
    notification_email: "",
    email_notifications: true,
    notification_frequency: "monthly"
  });
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const resetNewAffiliate = () => {
    setNewAffiliate({
      coupon: "",
      email: "",
      password: "",
      confirmPassword: "",
      payment_method: "",
      payment_details: "",
      notification_email: "",
      email_notifications: true,
      notification_frequency: "monthly"
    });
    setValidationErrors({});
  };

  const validateNewAffiliate = () => {
    const errors: {[key: string]: string} = {};
    
    if (!newAffiliate.coupon) errors.coupon = "Coupon code is required";
    else if (!/^[A-Z0-9]+$/.test(newAffiliate.coupon)) errors.coupon = "Coupon must be uppercase letters and numbers only";
    
    if (newAffiliate.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAffiliate.email)) 
      errors.email = "Invalid email format";
    
    if (!newAffiliate.password) errors.password = "Password is required";
    else if (newAffiliate.password.length < 6) errors.password = "Password must be at least 6 characters";
    
    if (newAffiliate.password !== newAffiliate.confirmPassword) 
      errors.confirmPassword = "Passwords don't match";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAffiliate = async () => {
    if (!validateNewAffiliate()) return;
    
    try {
      // Hash password with bcrypt before storing
      const hashedPassword = await bcrypt.hash(newAffiliate.password, 10);
      
      const { error } = await supabase
        .from('thg_affiliate_users')
        .insert([
          {
            coupon: newAffiliate.coupon,
            password: hashedPassword,
            email: newAffiliate.email || null,
            role: 'affiliate',
            payment_method: newAffiliate.payment_method || null,
            payment_details: newAffiliate.payment_details || null,
            notification_email: newAffiliate.notification_email || null,
            notification_frequency: newAffiliate.notification_frequency || null,
            email_notifications: newAffiliate.email_notifications
          }
        ]);
      
      if (error) throw error;
      
      toast.success("Affiliate added successfully");
      setIsOpen(false);
      resetNewAffiliate();
      onAffilateAdded();
    } catch (error: any) {
      console.error("Error adding affiliate:", error);
      
      if (error.code === '23505') { // Unique violation
        toast.error("This coupon code already exists");
        setValidationErrors({
          ...validationErrors,
          coupon: "This coupon code already exists"
        });
      } else {
        toast.error(`Failed to add affiliate: ${error.message || 'Unknown error'}`);
      }
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetNewAffiliate();
    }}>
      <DialogTrigger asChild>
        <Button className="bg-[#3B751E] hover:bg-[#3B751E]/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Affiliate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Affiliate</DialogTitle>
          <DialogDescription>
            Create a new affiliate account with a unique coupon code.
          </DialogDescription>
        </DialogHeader>
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
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Password Security</AlertTitle>
          <AlertDescription>
            The password will be stored securely. New affiliates should change their password after first login.
          </AlertDescription>
        </Alert>
        <DialogFooter>
          <Button
            type="button" 
            variant="outline" 
            onClick={() => {
              setIsOpen(false);
              resetNewAffiliate();
            }}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleAddAffiliate}>Create Affiliate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
