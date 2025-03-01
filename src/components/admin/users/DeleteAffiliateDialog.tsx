
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";
import { AffiliateUser } from "@/components/admin/users/types";

interface DeleteAffiliateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  affiliate: AffiliateUser;
  onDelete: () => void;
  onClose: () => void;
}

export const DeleteAffiliateDialog = ({
  open,
  onOpenChange,
  affiliate,
  onDelete,
  onClose,
}: DeleteAffiliateDialogProps) => {
  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      onClose();
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Delete Affiliate"
      description={`Are you sure you want to delete the affiliate with coupon code: ${affiliate.coupon}?`}
      confirmText="Delete"
      cancelText="Cancel"
      variant="destructive"
      onConfirm={onDelete}
    >
      <Alert variant="destructive" className="mt-4">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          This action is irreversible. All data associated with this affiliate will be permanently deleted.
        </AlertDescription>
      </Alert>
    </ConfirmDialog>
  );
};
