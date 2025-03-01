
import { LogOut, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  user: { coupon_code: string; role: string } | null;
  isAdmin: boolean;
  onLogout: () => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const MobileMenu = ({ 
  user, 
  isAdmin, 
  onLogout, 
  setMobileMenuOpen 
}: MobileMenuProps) => {
  const navigate = useNavigate();
  
  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };
  
  return (
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
  );
};
