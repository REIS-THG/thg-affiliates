
import { useState } from "react";
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
import { Plus } from "lucide-react";
import { NewAffiliateForm } from "@/components/admin/users/types";
import { validateNewAffiliate } from "@/components/admin/users/utils/validation";
import { createAffiliate } from "@/components/admin/users/utils/affiliateServices";
import { AffiliateForm } from "@/components/admin/users/AffiliateForm";
import { SecurityAlert } from "@/components/admin/users/SecurityAlert";

interface AddAffiliateDialogProps {
  onAffilateAdded: () => void;
}

export const AddAffiliateDialog = ({ onAffilateAdded }: AddAffiliateDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
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

  const handleAddAffiliate = async () => {
    const { errors, isValid } = validateNewAffiliate(newAffiliate);
    setValidationErrors(errors);
    
    if (!isValid) return;
    
    try {
      const { error } = await createAffiliate(newAffiliate);
      
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
        
        <AffiliateForm 
          newAffiliate={newAffiliate}
          setNewAffiliate={setNewAffiliate}
          validationErrors={validationErrors}
        />
        
        <SecurityAlert />
        
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
