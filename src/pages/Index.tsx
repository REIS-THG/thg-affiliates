
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, ShieldCheck, Users } from "lucide-react";

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
        
        {/* The "Key Features" section has been removed */}
        
        {!isAuthenticated && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-4xl text-center">
              <h2 className="text-3xl font-bold text-[#3B751E] mb-6">
                Join Our Affiliate Program
              </h2>
              <p className="text-lg text-[#9C7705]/70 mb-8 max-w-2xl mx-auto">
                Become an affiliate partner and start earning commissions on every referral. 
                Our program offers competitive rates and real-time tracking of your earnings.
              </p>
              
              <div className="bg-[#F9F7F0] p-8 rounded-lg shadow-sm border border-[#9C7705]/10 mb-8">
                <div className="grid md:grid-cols-3 gap-6 text-center mb-8">
                  <div>
                    <div className="bg-[#3B751E]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-[#3B751E]">1</span>
                    </div>
                    <h3 className="font-medium text-[#3B751E]">Apply to Join</h3>
                    <p className="text-sm text-[#9C7705]/70 mt-2">
                      Fill out our simple application form
                    </p>
                  </div>
                  
                  <div>
                    <div className="bg-[#3B751E]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-[#3B751E]">2</span>
                    </div>
                    <h3 className="font-medium text-[#3B751E]">Get Approved</h3>
                    <p className="text-sm text-[#9C7705]/70 mt-2">
                      Receive your affiliate coupon code
                    </p>
                  </div>
                  
                  <div>
                    <div className="bg-[#3B751E]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-[#3B751E]">3</span>
                    </div>
                    <h3 className="font-medium text-[#3B751E]">Start Earning</h3>
                    <p className="text-sm text-[#9C7705]/70 mt-2">
                      Share your code and track earnings
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSfqUn0QmIJhc1wf5u24k9zXoy9ingwqC5JD6OhvzfRbprbXHg/viewform?usp=sharing", "_blank")}
                  size="lg"
                  className="bg-[#3B751E] hover:bg-[#3B751E]/90 text-white"
                >
                  Apply to Join
                  <Users className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-center space-x-4">
                <p className="text-[#9C7705]/70">Already an affiliate?</p>
                <Button
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="border-[#3B751E] text-[#3B751E] hover:bg-[#3B751E]/10"
                >
                  Sign In to Dashboard
                </Button>
              </div>
            </div>
          </section>
        )}
        
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
