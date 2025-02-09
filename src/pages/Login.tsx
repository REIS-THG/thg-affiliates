
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

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
      const { data: adminUser, error: adminError } = await supabase
        .from('THG_Affiliate_Admin_Users')
        .select('*')
        .eq('username', couponCode.trim())
        .eq('password_hash', password.trim())
        .single();

      if (adminUser) {
        // Update last login timestamp
        await supabase
          .from('THG_Affiliate_Admin_Users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', adminUser.id);

        const userData = { 
          coupon_code: adminUser.username,
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
      console.log("Attempting affiliate login with coupon code:", couponCode);
      
      const { data: affiliateUser, error } = await supabase
        .from('THG_Affiliate_Users')
        .select('*')
        .eq('coupon', couponCode.trim())
        .eq('password', password.trim())
        .single();

      console.log("Login response:", { affiliateUser, error });

      if (error) {
        console.error("Supabase error:", error);
        toast({
          title: "Error",
          description: "Invalid coupon code or password",
          variant: "destructive",
        });
        return;
      }

      if (affiliateUser) {
        localStorage.setItem('affiliateUser', JSON.stringify(affiliateUser));
        toast({
          title: "Success",
          description: "Successfully logged in",
        });
        navigate("/");
      } else {
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
