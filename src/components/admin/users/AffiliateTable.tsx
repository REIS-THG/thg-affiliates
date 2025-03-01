
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, RefreshCw, Trash2 } from "lucide-react";
import { AffiliateUser } from "@/components/admin/users/types";
import { EditAffiliateDialog } from "@/components/admin/users/EditAffiliateDialog";
import { DeleteAffiliateDialog } from "@/components/admin/users/DeleteAffiliateDialog";

interface AffiliateTableProps {
  affiliates: AffiliateUser[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const AffiliateTable = ({ 
  affiliates, 
  isLoading,
  onRefresh 
}: AffiliateTableProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAffiliate, setCurrentAffiliate] = useState<AffiliateUser | null>(null);

  const handleEditAffiliate = async (updatedAffiliate: AffiliateUser) => {
    try {
      const { error } = await supabase
        .from('thg_affiliate_users')
        .update({
          email: updatedAffiliate.email,
          payment_method: updatedAffiliate.payment_method,
          payment_details: updatedAffiliate.payment_details,
          notification_email: updatedAffiliate.notification_email,
          notification_frequency: updatedAffiliate.notification_frequency,
          email_notifications: updatedAffiliate.email_notifications
        })
        .eq('id', updatedAffiliate.id);
      
      if (error) throw error;
      
      toast.success("Affiliate updated successfully");
      setIsEditDialogOpen(false);
      onRefresh();
    } catch (error: any) {
      console.error("Error updating affiliate:", error);
      toast.error(`Failed to update affiliate: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDeleteAffiliate = async () => {
    if (!currentAffiliate) return;
    
    try {
      const { error } = await supabase
        .from('thg_affiliate_users')
        .delete()
        .eq('id', currentAffiliate.id);
      
      if (error) throw error;
      
      toast.success("Affiliate deleted successfully");
      setIsDeleteDialogOpen(false);
      onRefresh();
    } catch (error: any) {
      console.error("Error deleting affiliate:", error);
      toast.error(`Failed to delete affiliate: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Coupon Code</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Notifications</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex justify-center">
                  <RefreshCw className="h-6 w-6 animate-spin text-[#3B751E]" />
                </div>
              </TableCell>
            </TableRow>
          ) : affiliates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No affiliate users found.
              </TableCell>
            </TableRow>
          ) : (
            affiliates.map((affiliate) => (
              <TableRow key={affiliate.id}>
                <TableCell className="font-medium">{affiliate.coupon}</TableCell>
                <TableCell>{affiliate.email || "-"}</TableCell>
                <TableCell>{affiliate.payment_method || "-"}</TableCell>
                <TableCell>
                  {affiliate.email_notifications ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Enabled</Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500">Disabled</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {affiliate.created_at 
                    ? new Date(affiliate.created_at).toLocaleDateString() 
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentAffiliate(affiliate);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setCurrentAffiliate(affiliate);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {currentAffiliate && (
        <>
          <EditAffiliateDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            affiliate={currentAffiliate}
            onSave={handleEditAffiliate}
            onClose={() => setCurrentAffiliate(null)}
          />
          
          <DeleteAffiliateDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            affiliate={currentAffiliate}
            onDelete={handleDeleteAffiliate}
            onClose={() => setCurrentAffiliate(null)}
          />
        </>
      )}
    </div>
  );
};
