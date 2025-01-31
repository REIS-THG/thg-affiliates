import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const ForgotPassword = () => {
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Store the request in Supabase
      const { error: dbError } = await supabase
        .from('forgotten password requests')
        .insert([{ coupon_code: couponCode }]);

      if (dbError) throw dbError;

      // Send notification email
      const { error: emailError } = await supabase
        .functions.invoke('send-email', {
          body: {
            to: 'info@totalhomegrown.com',
            subject: `Forgot password - THG Coupon password for ${couponCode}`,
            text: `A password reset has been requested for coupon code: ${couponCode}`
          }
        });

      if (emailError) throw emailError;

      toast({
        title: "Request Submitted",
        description: "We'll contact you via discord about your password reset.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">THG Affiliate</h1>
          <p className="text-xl text-muted-foreground">Forgotten Password</p>
          <p className="text-muted-foreground">
            Enter your coupon code below and we'll contact you via Discord to help reset your password.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
          <div className="text-center">
            <Link to="/login" className="text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ForgotPassword;