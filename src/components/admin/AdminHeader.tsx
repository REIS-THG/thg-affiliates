
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AdminStatsProps {
  adminStats: {
    totalAffiliates: number;
    activeAffiliates: number;
    totalEarnings: number;
    pendingPayouts: number;
  };
}

export const AdminStats = ({ adminStats }: AdminStatsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/70 p-4 rounded-lg shadow-sm border border-[#9C7705]/10 backdrop-blur-sm">
          <div className="text-[#3B751E] text-lg font-semibold">Total Affiliates</div>
          <div className="text-3xl font-bold mt-2">{adminStats.totalAffiliates}</div>
        </div>
        <div className="bg-white/70 p-4 rounded-lg shadow-sm border border-[#9C7705]/10 backdrop-blur-sm">
          <div className="text-[#3B751E] text-lg font-semibold">Active Affiliates</div>
          <div className="text-3xl font-bold mt-2">{adminStats.activeAffiliates}</div>
        </div>
        <div className="bg-white/70 p-4 rounded-lg shadow-sm border border-[#9C7705]/10 backdrop-blur-sm">
          <div className="text-[#3B751E] text-lg font-semibold">Total Earnings</div>
          <div className="text-3xl font-bold mt-2">${adminStats.totalEarnings.toFixed(2)}</div>
        </div>
        <div className="bg-white/70 p-4 rounded-lg shadow-sm border border-[#9C7705]/10 backdrop-blur-sm">
          <div className="text-[#3B751E] text-lg font-semibold">Pending Payouts</div>
          <div className="text-3xl font-bold mt-2">${adminStats.pendingPayouts.toFixed(2)}</div>
        </div>
      </div>
      
      <Alert className="mb-6 border-amber-300 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Important</AlertTitle>
        <AlertDescription className="text-amber-700">
          CSV imports should be performed directly in the Supabase dashboard. Please refer to the data import guide for details.
        </AlertDescription>
      </Alert>
    </>
  );
};

export const AdminHeader = () => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-[#3B751E]">Admin Panel</h1>
      <p className="text-[#9C7705]/70">
        Manage affiliates, export data, and configure system settings
      </p>
    </div>
  );
};
