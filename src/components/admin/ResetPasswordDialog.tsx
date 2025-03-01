
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound } from "lucide-react";
import { PasswordSection } from "../dashboard/settings/PasswordSection";

interface ResetPasswordDialogProps {
  couponCode: string;
  userEmail?: string;
}

export const ResetPasswordDialog = ({ couponCode, userEmail }: ResetPasswordDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [isResetComplete, setIsResetComplete] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleSendResetEmail = async () => {
    if (!userEmail) {
      toast({
        title: "Missing Email",
        description: "This user doesn't have an email address. Reset the password directly.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingEmail(true);
    try {
      // Send the notification email using the edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-password-reset-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ 
            couponCode,
            adminEmail: userEmail 
          }),
        }
      );
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to send password reset email");
      }

      toast({
        title: "Email Sent",
        description: `Password reset instructions sent to ${userEmail}`,
      });
    } catch (error) {
      console.error("Error sending reset email:", error);
      toast({
        title: "Error",
        description: "Failed to send password reset email",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
        >
          <KeyRound className="h-3.5 w-3.5" />
          Reset Password
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password for {couponCode}</DialogTitle>
          <DialogDescription>
            You can either send reset instructions via email or set a new password directly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {userEmail && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">User Email</Label>
                <span className="text-sm text-muted-foreground">{userEmail}</span>
              </div>
              <Button 
                onClick={handleSendResetEmail} 
                className="w-full bg-primary"
                disabled={isSendingEmail}
              >
                {isSendingEmail ? "Sending Email..." : "Send Reset Instructions"}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>
            </div>
          )}

          <PasswordSection couponCode={couponCode} isAdminReset={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
