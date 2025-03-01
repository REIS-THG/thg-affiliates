
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "../integrations/supabase/client";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

const Login = () => {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const savedCoupon = localStorage.getItem('rememberedCoupon');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (savedCoupon && savedRememberMe) {
      setCouponCode(savedCoupon);
      setRememberMe(true);
    }
    
    setTimeout(() => setIsInitializing(false), 300);
  }, []);

  const getErrorMessage = (error: Error | string): string => {
    const message = typeof error === 'string' ? error : error.message;
    
    if (message.includes('password')) {
      return "The password is incorrect. Please try again.";
    } else if (message.includes('not found') || message.includes('Invalid coupon')) {
      return "This coupon code doesn't exist or isn't active. Please check and try again.";
    } else if (message.includes('network')) {
      return "Network error. Please check your internet connection and try again.";
    } else if (message.includes('rate limit')) {
      return "Too many login attempts. Please try again in a few minutes.";
    } else if (message.includes('invalid')) {
      return "Invalid login credentials. Please check your coupon code and password.";
    }
    
    return message || "An unknown error occurred. Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (rememberMe) {
        localStorage.setItem('rememberedCoupon', couponCode);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberedCoupon');
        localStorage.setItem('rememberMe', 'false');
      }

      console.log("Attempting login with:", { couponCode, passwordLength: password.length });
      
      const { data, error } = await supabase
        .from('thg_affiliate_users')
        .select('*')
        .eq('coupon', couponCode)
        .eq('password', password)
        .maybeSingle();

      console.log("Login response:", { data: !!data, error });

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
      }

      if (!data) {
        console.error("No matching user found");
        throw new Error("Invalid coupon code or password");
      }

      localStorage.setItem('affiliateUser', JSON.stringify({
        coupon_code: data.coupon,
        role: data.role || 'affiliate'
      }));

      toast.success("Login successful! Redirecting to dashboard...");
      navigate('/dashboard');
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = getErrorMessage(error instanceof Error ? error : String(error));
      setError(errorMessage);
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#F9F7F0] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-8 border border-[#9C7705]/10">
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
            <Skeleton className="h-6 w-32 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F0] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-8 border border-[#9C7705]/10">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <img
              src="/placeholder.svg"
              alt="Logo"
              className="h-12 w-12"
            />
          </div>
          <h1 className="text-2xl font-bold text-[#3B751E]">Welcome Back</h1>
          <p className="text-[#9C7705]/70">Sign in to your affiliate account</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="couponCode" className="text-[#3B751E]">
              Coupon Code
            </Label>
            <Input
              id="couponCode"
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="border-[#9C7705]/20 focus:ring-[#3B751E]/50"
              placeholder="Enter your coupon code"
              required
              disabled={isLoading}
              aria-describedby="coupon-error"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#3B751E]">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-[#9C7705]/20 focus:ring-[#3B751E]/50"
                placeholder="Enter your password"
                required
                disabled={isLoading}
                aria-describedby="password-error"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9C7705]/70"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="rememberMe" 
                checked={rememberMe} 
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="border-[#9C7705]/30 data-[state=checked]:bg-[#3B751E] data-[state=checked]:border-[#3B751E]"
                aria-label="Remember me"
              />
              <Label 
                htmlFor="rememberMe" 
                className="text-sm text-[#9C7705]/70 cursor-pointer"
              >
                Remember me
              </Label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-[#3B751E] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-[#3B751E] hover:bg-[#3B751E]/90 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B751E]/50 transition-colors disabled:opacity-50"
            aria-live="polite"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
