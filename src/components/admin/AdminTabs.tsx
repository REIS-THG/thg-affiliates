
import { lazy, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FileText, Settings } from "lucide-react";

// Lazy load tab content components
const UserManagement = lazy(() => import("@/components/admin/UserManagement").then(module => ({ default: module.UserManagement })));
const DataExport = lazy(() => import("@/components/admin/DataExport").then(module => ({ default: module.DataExport })));
const SystemSettings = lazy(() => import("@/components/admin/SystemSettings").then(module => ({ default: module.SystemSettings })));

const TabLoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-pulse text-[#3B751E] text-xl">Loading content...</div>
  </div>
);

export const AdminTabs = () => {
  return (
    <div className="bg-white/70 rounded-lg shadow-sm border border-[#9C7705]/10 backdrop-blur-sm">
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="w-full border-b border-[#9C7705]/10 rounded-t-lg rounded-b-none bg-[#F9F7F0] p-0">
          <TabsTrigger value="users" className="flex-1 rounded-none rounded-tl-lg data-[state=active]:bg-white data-[state=active]:shadow-none py-3">
            <User className="w-4 h-4 mr-2" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="export" className="flex-1 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none py-3">
            <FileText className="w-4 h-4 mr-2" />
            Data Export
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1 rounded-none rounded-tr-lg data-[state=active]:bg-white data-[state=active]:shadow-none py-3">
            <Settings className="w-4 h-4 mr-2" />
            System Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="p-6 focus-visible:outline-none focus-visible:ring-0">
          <Suspense fallback={<TabLoadingFallback />}>
            <UserManagement />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="export" className="p-6 focus-visible:outline-none focus-visible:ring-0">
          <Suspense fallback={<TabLoadingFallback />}>
            <DataExport />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="settings" className="p-6 focus-visible:outline-none focus-visible:ring-0">
          <Suspense fallback={<TabLoadingFallback />}>
            <SystemSettings />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};
