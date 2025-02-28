
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { authStateChanged } from "../App";

const Login = () => {
  const [couponCode, setCouponCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Authenticate user with Supabase
      const { data: affiliateUser, error } = await supabase
        .from('thg_affiliate_users')
        .select('*')
        .eq('coupon', couponCode.trim())
        .eq('password', password) // Note: In production, use proper password hashing
        .single();

      if (error || !affiliateUser) {
        throw new Error('Invalid credentials');
      }

      // Store user data in localStorage
      localStorage.setItem('affiliateUser', JSON.stringify({
        id: affiliateUser.id,
        coupon_code: affiliateUser.coupon,
        role: affiliateUser.role,
        email: affiliateUser.email,
        notification_email: affiliateUser.notification_email,
        notification_frequency: affiliateUser.notification_frequency,
        email_notifications: affiliateUser.email_notifications,
        payment_method: affiliateUser.payment_method,
        payment_details: affiliateUser.payment_details
      }));
      
      // Trigger auth state change
      authStateChanged();
      
      toast({
        title: "Success",
        description: "Successfully logged in",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "Invalid coupon code or password. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F7F0]">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-lg">
        <div className="space-y-2 text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-[#3B751E]" />
          <h1 className="text-3xl font-bold text-[#3B751E]">Affiliate Portal</h1>
          <p className="text-muted-foreground">Sign in to your affiliate dashboard</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="border-[#9C7705]/30 focus-visible:ring-[#3B751E]"
              required
            />
          </div>
          <div className="space-y-2 relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-[#9C7705]/30 focus-visible:ring-[#3B751E]"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9C7705]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-[#3B751E] hover:bg-[#3B751E]/90 text-white" 
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
          <div className="text-center">
            <Link to="/forgot-password" className="text-[#3B751E] hover:underline">
              Forgot password?
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Login;
