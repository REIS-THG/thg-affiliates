
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  ShieldCheck, 
  X,
  BarChart3 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  onLogout: () => void;
}

export const Header = ({ onLogout }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ coupon_code: string; role: string } | null>(null);
  
  useEffect(() => {
    const userStr = localStorage.getItem('affiliateUser');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const isAdmin = user?.role === 'admin';
  
  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-[#9C7705]/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src="/placeholder.svg"
            alt="Logo"
            className="h-8 w-8 mr-2"
          />
          <span className="font-bold text-xl text-[#3B751E]">
            Affiliate Portal
          </span>
        </Link>

        {!isMobile ? (
          <div className="flex items-center gap-6">
            {user && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/dashboard")}
                  className={`${
                    location.pathname === "/dashboard"
                      ? "bg-[#3B751E]/10 text-[#3B751E]"
                      : "text-[#9C7705]/70 hover:text-[#3B751E] hover:bg-[#3B751E]/10"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                
                {isAdmin && (
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/admin")}
                    className={`${
                      location.pathname === "/admin"
                        ? "bg-[#3B751E]/10 text-[#3B751E]"
                        : "text-[#9C7705]/70 hover:text-[#3B751E] hover:bg-[#3B751E]/10"
                    }`}
                  >
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-[#9C7705]/20">
                      {user.coupon_code}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            
            {!user && (
              <Button onClick={() => navigate("/login")} className="bg-[#3B751E] hover:bg-[#3B751E]/90">
                Sign In
              </Button>
            )}
          </div>
        ) : (
          <div>
            {!mobileMenuOpen ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6 text-[#3B751E]" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6 text-[#3B751E]" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && mobileMenuOpen && (
        <div className="bg-white border-t border-[#9C7705]/10 py-4 px-6 space-y-4 shadow-lg">
          {user ? (
            <>
              <div className="pb-2 mb-2 border-b border-[#9C7705]/10">
                <div className="font-medium text-[#3B751E]">{user.coupon_code}</div>
                <div className="text-sm text-[#9C7705]/70">{isAdmin ? 'Administrator' : 'Affiliate'}</div>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start text-[#9C7705]/70 hover:text-[#3B751E] hover:bg-[#3B751E]/10"
                onClick={() => handleNavigate("/dashboard")}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              
              {isAdmin && (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-[#9C7705]/70 hover:text-[#3B751E] hover:bg-[#3B751E]/10"
                  onClick={() => handleNavigate("/admin")}
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              )}
              
              <Button
                variant="ghost"
                className="w-full justify-start text-[#9C7705]/70 hover:text-[#3B751E] hover:bg-[#3B751E]/10"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <Button 
              className="w-full bg-[#3B751E] hover:bg-[#3B751E]/90"
              onClick={() => handleNavigate("/login")}
            >
              Sign In
            </Button>
          )}
        </div>
      )}
    </header>
  );
};
