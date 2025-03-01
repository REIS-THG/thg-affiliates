
import { LayoutDashboard, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NavItemsProps {
  isAdmin: boolean;
}

export const NavItems = ({ isAdmin }: NavItemsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
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
    </>
  );
};
