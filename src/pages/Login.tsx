
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { authStateChanged } from "../App";

const Login = () => {
  const [couponCode, setCouponCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!couponCode || !password) {
      toast.error("Please enter both coupon code and password");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Attempting login with:", couponCode.trim(), password);
      
      // Authenticate user with Supabase
      const { data: affiliateUser, error } = await supabase
        .from('thg_affiliate_users')
        .select('*')
        .eq('coupon', couponCode.trim())
        .eq('password', password)
        .maybeSingle();

      console.log("Login response:", { affiliateUser, error });

      if (error) {
        console.error("Supabase error:", error);
        throw new Error('Database error occurred');
      }
      
      if (!affiliateUser) {
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
      
      toast.success("Successfully logged in");
      
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : "Invalid coupon code or password. Please check your credentials."
      );
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
            <h1 className="text-3xl font-bold text-[#3B751E]">Affiliate Portal</h1>
            <p className="text-[#9C7705]/70">Sign in to access your affiliate dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#3B751E]">Coupon Code</label>
              <Input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="border-[#9C7705]/30 focus-visible:ring-[#3B751E]"
                placeholder="Enter your coupon code"
                required
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#3B751E]">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-[#9C7705]/30 focus-visible:ring-[#3B751E] pr-10"
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9C7705] h-7 w-7"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#3B751E] hover:bg-[#3B751E]/90 text-white transition-all"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            
            <div className="text-center text-sm">
              <Link to="/forgot-password" className="text-[#3B751E] hover:underline font-medium">
                Forgot password?
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
