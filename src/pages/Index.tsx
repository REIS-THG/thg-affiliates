
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, ChevronRight, ShieldCheck, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('affiliateUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsAuthenticated(true);
        setIsAdmin(user.role === 'admin');
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F7F0] flex flex-col">
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#9C7705]/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/placeholder.svg"
              alt="Logo"
              className="h-8 w-8 mr-2"
            />
            <span className="font-bold text-xl text-[#3B751E]">
              Affiliate Portal
            </span>
          </div>
          <div>
            {isAuthenticated ? (
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-[#3B751E] hover:bg-[#3B751E]/90"
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="bg-[#3B751E] hover:bg-[#3B751E]/90"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="bg-[#3B751E] text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-6">Affiliate Management Portal</h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Track your affiliate earnings, view usage statistics, and manage your account in one place.
            </p>
            {isAuthenticated ? (
              <Button
                onClick={() => navigate("/dashboard")}
                size="lg"
                className="bg-white text-[#3B751E] hover:bg-white/90"
              >
                Go to Dashboard
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                size="lg"
                className="bg-white text-[#3B751E] hover:bg-white/90"
              >
                Sign In
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-[#3B751E] mb-12">
              Key Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-[#F9F7F0] p-6 rounded-lg text-center">
                <div className="bg-[#3B751E]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-[#3B751E]" />
                </div>
                <h3 className="text-xl font-semibold text-[#3B751E] mb-2">
                  Performance Tracking
                </h3>
                <p className="text-[#9C7705]/70">
                  Monitor your affiliate performance with detailed analytics and reporting tools.
                </p>
              </div>
              
              <div className="bg-[#F9F7F0] p-6 rounded-lg text-center">
                <div className="bg-[#3B751E]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-[#3B751E]" />
                </div>
                <h3 className="text-xl font-semibold text-[#3B751E] mb-2">
                  User Management
                </h3>
                <p className="text-[#9C7705]/70">
                  Easily manage affiliate accounts and track individual performance metrics.
                </p>
              </div>
              
              <div className="bg-[#F9F7F0] p-6 rounded-lg text-center">
                <div className="bg-[#3B751E]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="h-8 w-8 text-[#3B751E]" />
                </div>
                <h3 className="text-xl font-semibold text-[#3B751E] mb-2">
                  Admin Controls
                </h3>
                <p className="text-[#9C7705]/70">
                  Powerful administration tools for managing affiliates and system settings.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {isAdmin && (
          <section className="py-12 bg-[#3B751E]/10">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold text-[#3B751E] mb-4">
                Administrator Access
              </h2>
              <p className="text-[#9C7705]/70 mb-6 max-w-2xl mx-auto">
                You have administrative privileges. Access the admin panel to manage users, export data, and configure system settings.
              </p>
              <Button
                onClick={() => navigate("/admin")}
                className="bg-[#3B751E] hover:bg-[#3B751E]/90"
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                Go to Admin Panel
              </Button>
            </div>
          </section>
        )}
      </main>
      
      <footer className="bg-white border-t border-[#9C7705]/10 py-8">
        <div className="container mx-auto px-4 text-center text-[#9C7705]/70 text-sm">
          <p>&copy; {new Date().getFullYear()} Affiliate Management Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
