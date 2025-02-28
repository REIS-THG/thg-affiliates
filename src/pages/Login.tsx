
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "../integrations/supabase/client";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Fetch user data from Supabase
      const { data, error } = await supabase
        .from('thg_affiliate_users')
        .select('*')
        .eq('coupon', couponCode)
        .eq('password', password)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("Invalid coupon code or password");
      }

      // Store user data in localStorage (consider using a more secure method in production)
      localStorage.setItem('affiliateUser', JSON.stringify({
        coupon_code: data.coupon,
        role: data.role || 'affiliate'
      }));

      toast.success("Login successful!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

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
            <label htmlFor="couponCode" className="block text-sm font-medium text-[#3B751E]">
              Coupon Code
            </label>
            <input
              id="couponCode"
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-[#9C7705]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B751E]/50"
              placeholder="Enter your coupon code"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-[#3B751E]">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-[#9C7705]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B751E]/50"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9C7705]/70"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-[#3B751E] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-[#3B751E] hover:bg-[#3B751E]/90 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B751E]/50 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-[#9C7705]/70">
            Don't have an account?{" "}
            <span className="text-[#3B751E] font-medium">
              Contact support
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
