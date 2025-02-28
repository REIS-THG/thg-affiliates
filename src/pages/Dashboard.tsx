
import { Header } from "@/components/Header";
import { AuthHandler } from "@/components/dashboard/AuthHandler";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { LoadingScreen } from "@/components/dashboard/LoadingScreen";

const Dashboard = () => {
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
            <div className="container mx-auto p-6">
              <DashboardHeader 
                isAdmin={isAdmin}
                viewAll={viewAll}
                onViewToggle={handleViewToggle}
                couponCode={couponCode}
                userSettings={userSettings}
              />
              <DashboardContent 
                viewAll={viewAll}
                couponCode={couponCode}
              />
            </div>
          </div>
        );
      }}
    </AuthHandler>
  );
};

export default Dashboard;
