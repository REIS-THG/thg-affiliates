
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface HeaderProps {
  onLogout: () => void;
}

export const Header = ({ onLogout }: HeaderProps) => {
  return (
    <header className="border-b border-[#9C7705]/10 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#3B751E]">THG Affiliate Dashboard</h1>
        <Button 
          variant="ghost" 
          onClick={onLogout}
          className="text-[#3B751E] hover:bg-[#3B751E]/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
};
