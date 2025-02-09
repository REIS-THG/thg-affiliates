
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
      // Check for admin login first
      console.log("Admin login attempt:", {
        username: couponCode.trim(),
        passwordLength: password.trim().length
      });

      const { data: adminData, error: adminError } = await supabase
        .from('thg_affiliate_admin_users')
        .select('*')
        .eq('username', couponCode.trim())
        .eq('password_hash', password.trim())
        .maybeSingle();

      console.log("Admin login response:", { adminData, adminError });

      if (adminData) {
        console.log("Admin login successful:", adminData);
        
        // Update last login timestamp
        const { error: updateError } = await supabase
          .from('thg_affiliate_admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', adminData.id);

        if (updateError) {
          console.error("Error updating admin last login:", updateError);
        }

        const userData = { 
          coupon_code: adminData.username,
          role: "admin" 
        };
        localStorage.setItem('affiliateUser', JSON.stringify(userData));
        toast({
          title: "Success",
          description: "Successfully logged in as admin",
        });
        navigate("/");
        return;
      }
      
      // If not admin, check affiliate users
      console.log("Attempting affiliate login:", {
        couponCode: couponCode.trim(),
        passwordLength: password.trim().length
      });
      
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('THG_Affiliate_Users')
        .select('*')
        .eq('coupon', couponCode.trim())
        .eq('password', password.trim())
        .maybeSingle();

      console.log("Affiliate login response:", { affiliateData, affiliateError });

      if (affiliateData) {
        console.log("Affiliate login successful:", affiliateData);
        localStorage.setItem('affiliateUser', JSON.stringify(affiliateData));
        toast({
          title: "Success",
          description: "Successfully logged in",
        });
        navigate("/");
      } else {
        console.log("Login failed: No matching user found");
        toast({
          title: "Error",
          description: "Invalid coupon code or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "Failed to sign in. Please check your credentials.",
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
          <h1 className="text-3xl font-bold">THG Affiliate Login</h1>
          <p className="text-muted-foreground">Sign in to your affiliate dashboard</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
          <div className="text-center">
            <Link to="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Login;
