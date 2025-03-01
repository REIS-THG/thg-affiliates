
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useErrorContext } from "@/contexts/ErrorContext";

const ForgotPassword = () => {
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { handleApiError } = useErrorContext();

  const validateCouponExists = async () => {
    try {
      const { data, error } = await supabase
        .from('thg_affiliate_users')
        .select('coupon')
        .eq('coupon', couponCode)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast.error("Coupon code not found. Please check and try again.");
        return false;
      }
      
      return true;
    } catch (error) {
      handleApiError(error, "Error validating coupon code. Please try again.");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show confirmation dialog
    if (await validateCouponExists()) {
      setShowConfirmDialog(true);
    }
  };

  const submitPasswordResetRequest = async () => {
    setLoading(true);

    try {
      // Call the edge function to send the password reset email
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-password-reset-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ couponCode }),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit password reset request");
      }
      
      const result = await response.json();

      setSubmitted(true);
      toast.success("Password reset request submitted", {
        description: "Our team will contact you shortly.",
      });
    } catch (error) {
      handleApiError(error, "Failed to submit request. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F9F7F0] to-[#F3EFE0]">
      <div className="w-full max-w-md p-6">
        <Card className="w-full p-8 space-y-6 shadow-xl border-[#9C7705]/20">
          <div className="space-y-3 text-center">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-[#3B751E]/10 flex items-center justify-center">
                <ShieldCheck className="h-8 w-8 text-[#3B751E]" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[#3B751E]">Forgot Password</h1>
            {!submitted ? (
              <p className="text-[#9C7705]/70">
                Enter your coupon code below and we'll contact you to reset your password
              </p>
            ) : (
              <p className="text-[#9C7705]/70">
                Your request has been submitted. We'll contact you shortly to help reset your password.
              </p>
            )}
          </div>
          
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#3B751E]">Coupon Code</label>
                <Input
                  type="text"
                  placeholder="Enter your coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="border-[#9C7705]/30 focus-visible:ring-[#3B751E]"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#3B751E] hover:bg-[#3B751E]/90 text-white" 
                disabled={loading || !couponCode}
              >
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
              <div className="text-center text-sm">
                <Link 
                  to="/login" 
                  className="text-[#3B751E] hover:underline font-medium inline-flex items-center gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Login
                </Link>
              </div>
            </form>
          ) : (
            <div className="pt-4">
              <Link to="/login">
                <Button
                  variant="outline" 
                  className="w-full border-[#3B751E] text-[#3B751E] hover:bg-[#3B751E]/10"
                >
                  Return to Login
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Submit Password Reset Request"
        description="Are you sure you want to request a password reset? Our team will contact you to verify your identity."
        confirmText="Submit Request"
        cancelText="Cancel"
        variant="default"
        onConfirm={submitPasswordResetRequest}
      />
    </div>
  );
};

export default ForgotPassword;
