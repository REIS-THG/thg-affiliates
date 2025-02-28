
import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Edit, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AffiliateUser {
  id: string;
  coupon: string;
  email: string | null;
  role: string | null;
  payment_method: string | null;
  payment_details: string | null;
  email_notifications: boolean | null;
  notification_email: string | null;
  notification_frequency: string | null;
  created_at: string | null;
}

const ITEMS_PER_PAGE = 10;

export const UserManagement = () => {
  const { toast: uiToast } = useToast();
  const [affiliates, setAffiliates] = useState<AffiliateUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalAffiliates, setTotalAffiliates] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAffiliate, setCurrentAffiliate] = useState<AffiliateUser | null>(null);
  const [newAffiliate, setNewAffiliate] = useState({
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
  const [searchTerm, setSearchTerm] = useState("");
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const fetchAffiliates = async () => {
    setIsLoading(true);
    try {
      const startIndex = currentPage * ITEMS_PER_PAGE;
      
      let query = supabase
        .from('thg_affiliate_users')
        .select('*', { count: 'exact' })
        .eq('role', 'affiliate')
        .order('created_at', { ascending: false });
        
      if (searchTerm) {
        query = query.or(`coupon.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }
      
      const { data, count, error } = await query
        .range(startIndex, startIndex + ITEMS_PER_PAGE - 1);
      
      if (error) throw error;
      
      setAffiliates(data || []);
      setTotalAffiliates(count || 0);
    } catch (error) {
      console.error("Error fetching affiliate users:", error);
      toast.error("Failed to load affiliate users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliates();
  }, [currentPage, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchAffiliates();
  };

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
      const { error } = await supabase
        .from('thg_affiliate_users')
        .insert([
          {
            coupon: newAffiliate.coupon,
            password: newAffiliate.password, // In production, should be hashed
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
      setIsAddDialogOpen(false);
      resetNewAffiliate();
      fetchAffiliates();
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

  const handleEditAffiliate = async () => {
    if (!currentAffiliate) return;
    
    try {
      const { error } = await supabase
        .from('thg_affiliate_users')
        .update({
          email: currentAffiliate.email,
          payment_method: currentAffiliate.payment_method,
          payment_details: currentAffiliate.payment_details,
          notification_email: currentAffiliate.notification_email,
          notification_frequency: currentAffiliate.notification_frequency,
          email_notifications: currentAffiliate.email_notifications
        })
        .eq('id', currentAffiliate.id);
      
      if (error) throw error;
      
      toast.success("Affiliate updated successfully");
      setIsEditDialogOpen(false);
      fetchAffiliates();
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
      fetchAffiliates();
    } catch (error: any) {
      console.error("Error deleting affiliate:", error);
      toast.error(`Failed to delete affiliate: ${error.message || 'Unknown error'}`);
    }
  };

  const totalPages = Math.ceil(totalAffiliates / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input 
            type="text" 
            placeholder="Search by coupon or email" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Button type="submit" variant="outline">Search</Button>
        </form>
        <div className="flex gap-2">
          <Button 
            onClick={() => fetchAffiliates()} 
            variant="outline" 
            size="icon"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
              <Alert variant="warning" className="mb-4">
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
                    setIsAddDialogOpen(false);
                    resetNewAffiliate();
                  }}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleAddAffiliate}>Create Affiliate</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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
                      <Dialog open={isEditDialogOpen && currentAffiliate?.id === affiliate.id} onOpenChange={(open) => {
                        setIsEditDialogOpen(open);
                        if (!open) setCurrentAffiliate(null);
                      }}>
                        <DialogTrigger asChild>
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
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Affiliate</DialogTitle>
                            <DialogDescription>
                              Update details for coupon code: {currentAffiliate?.coupon}
                            </DialogDescription>
                          </DialogHeader>
                          {currentAffiliate && (
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-email" className="text-right">
                                  Email
                                </Label>
                                <Input
                                  id="edit-email"
                                  value={currentAffiliate.email || ""}
                                  onChange={(e) => setCurrentAffiliate({
                                    ...currentAffiliate,
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
                                  value={currentAffiliate.payment_method || ""}
                                  onChange={(e) => setCurrentAffiliate({
                                    ...currentAffiliate,
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
                                  value={currentAffiliate.payment_details || ""}
                                  onChange={(e) => setCurrentAffiliate({
                                    ...currentAffiliate,
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
                                    checked={currentAffiliate.email_notifications || false}
                                    onCheckedChange={(checked) => setCurrentAffiliate({
                                      ...currentAffiliate,
                                      email_notifications: checked
                                    })}
                                  />
                                  <Label htmlFor="edit-notifications">
                                    {currentAffiliate.email_notifications ? "Enabled" : "Disabled"}
                                  </Label>
                                </div>
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleEditAffiliate}>
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog open={isDeleteDialogOpen && currentAffiliate?.id === affiliate.id} onOpenChange={(open) => {
                        setIsDeleteDialogOpen(open);
                        if (!open) setCurrentAffiliate(null);
                      }}>
                        <DialogTrigger asChild>
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
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Affiliate</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete the affiliate with coupon code: {currentAffiliate?.coupon}?
                            </DialogDescription>
                          </DialogHeader>
                          <Alert variant="destructive" className="my-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Warning</AlertTitle>
                            <AlertDescription>
                              This action is irreversible. All data associated with this affiliate will be permanently deleted.
                            </AlertDescription>
                          </Alert>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteAffiliate}>
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentPage > 0 && setCurrentPage(p => p - 1)}
                className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const pageIndex = i + Math.max(0, currentPage - 2 + (currentPage < 2 ? 2 - currentPage : 0));
              if (pageIndex >= totalPages) return null;
              
              return (
                <PaginationItem key={pageIndex}>
                  <PaginationLink
                    onClick={() => setCurrentPage(pageIndex)}
                    isActive={currentPage === pageIndex}
                  >
                    {pageIndex + 1}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext 
                onClick={() => currentPage < totalPages - 1 && setCurrentPage(p => p + 1)}
                className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
