
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AffiliateUser } from "@/components/admin/users/types";

interface EditAffiliateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  affiliate: AffiliateUser;
  onSave: (updatedAffiliate: AffiliateUser) => void;
  onClose: () => void;
}

export const EditAffiliateDialog = ({
  open,
  onOpenChange,
  affiliate,
  onSave,
  onClose,
}: EditAffiliateDialogProps) => {
  const [editedAffiliate, setEditedAffiliate] = useState<AffiliateUser>(affiliate);

  useEffect(() => {
    setEditedAffiliate(affiliate);
  }, [affiliate]);

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Affiliate</DialogTitle>
          <DialogDescription>
            Update details for coupon code: {affiliate.coupon}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-email" className="text-right">
              Email
            </Label>
            <Input
              id="edit-email"
              value={editedAffiliate.email || ""}
              onChange={(e) => setEditedAffiliate({
                ...editedAffiliate,
                email: e.target.value
              })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-payment_method" className="text-right">
              Payment Method
            </Label>
            <Input
              id="edit-payment_method"
              value={editedAffiliate.payment_method || ""}
              onChange={(e) => setEditedAffiliate({
                ...editedAffiliate,
                payment_method: e.target.value
              })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-payment_details" className="text-right">
              Payment Details
            </Label>
            <Input
              id="edit-payment_details"
              value={editedAffiliate.payment_details || ""}
              onChange={(e) => setEditedAffiliate({
                ...editedAffiliate,
                payment_details: e.target.value
              })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-notifications" className="text-right">
              Notifications
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                id="edit-notifications"
                checked={editedAffiliate.email_notifications || false}
                onCheckedChange={(checked) => setEditedAffiliate({
                  ...editedAffiliate,
                  email_notifications: checked
                })}
              />
              <Label htmlFor="edit-notifications">
                {editedAffiliate.email_notifications ? "Enabled" : "Disabled"}
              </Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onSave(editedAffiliate)}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
