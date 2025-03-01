
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "./header/Logo";
import { NavItems } from "./header/NavItems";
import { UserDropdown } from "./header/UserDropdown";
import { MobileMenu } from "./header/MobileMenu";

interface HeaderProps {
  onLogout: () => void;
}

export const Header = ({ onLogout }: HeaderProps) => {
  const navigate = useNavigate();
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
  
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-[#9C7705]/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />

        {!isMobile ? (
          <div className="flex items-center gap-6">
            {user && (
              <>
                <NavItems isAdmin={isAdmin} />
                <UserDropdown 
                  couponCode={user.coupon_code} 
                  isAdmin={isAdmin} 
                  onLogout={onLogout} 
                />
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
        <MobileMenu 
          user={user}
          isAdmin={isAdmin}
          onLogout={onLogout}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      )}
    </header>
  );
};
