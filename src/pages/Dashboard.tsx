
import { useState } from "react";
import { Header } from "@/components/Header";
import { AuthHandler } from "@/components/dashboard/AuthHandler";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { LoadingScreen } from "@/components/dashboard/LoadingScreen";
import { AnimatePresence, motion } from "framer-motion";

const Dashboard = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Handle view toggles with smooth transitions
  const handleViewToggleWithTransition = (handler: (checked: boolean) => Promise<void>) => {
    return async (checked: boolean) => {
      setIsTransitioning(true);
      try {
        await handler(checked);
      } finally {
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }
    };
  };

  return (
    <AuthHandler>
      {({ 
        couponCode, 
        isAdmin, 
        viewAll, 
        userSettings, 
        isLoading, 
        handleViewToggle, 
        handleLogout 
      }) => {
        if (isLoading) {
          return <LoadingScreen />;
        }

        if (!couponCode) {
          return null;
        }

        return (
          <div className="min-h-screen bg-[#F9F7F0]">
            <Header onLogout={handleLogout} />
            <AnimatePresence mode="wait">
              <motion.div
                key={viewAll ? "all" : "personal"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="container mx-auto px-4 sm:px-6 py-4 md:py-6"
                role="main"
                aria-label="Dashboard content"
                id="main-content"
              >
                <DashboardHeader 
                  isAdmin={isAdmin}
                  viewAll={viewAll}
                  onViewToggle={handleViewToggleWithTransition(handleViewToggle)}
                  couponCode={couponCode}
                  userSettings={userSettings}
                  isTransitioning={isTransitioning}
                />
                <DashboardContent 
                  viewAll={viewAll}
                  couponCode={couponCode}
                  isTransitioning={isTransitioning}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        );
      }}
    </AuthHandler>
  );
};

export default Dashboard;
