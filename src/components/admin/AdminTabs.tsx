
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/admin/UserManagement";
import { DataExport } from "@/components/admin/DataExport";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { AlertCircle } from "lucide-react";

interface AdminTabsProps {
  permissions?: Record<string, boolean>;
}

export const AdminTabs = ({ permissions = {} }: AdminTabsProps) => {
  const [activeTab, setActiveTab] = useState("users");
  
  // Default to true if permissions object is empty (backward compatibility)
  const hasUserPermission = Object.keys(permissions).length === 0 || permissions.users;
  const hasExportPermission = Object.keys(permissions).length === 0 || permissions.export;
  const hasSettingsPermission = Object.keys(permissions).length === 0 || permissions.settings;

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="mt-8">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-3 w-full max-w-2xl mx-auto mb-8">
          <TabsTrigger 
            value="users" 
            disabled={!hasUserPermission}
            className="data-[state=active]:bg-[#3B751E] data-[state=active]:text-white"
          >
            User Management
          </TabsTrigger>
          <TabsTrigger 
            value="export" 
            disabled={!hasExportPermission}
            className="data-[state=active]:bg-[#3B751E] data-[state=active]:text-white"
          >
            Data Export
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            disabled={!hasSettingsPermission}
            className="data-[state=active]:bg-[#3B751E] data-[state=active]:text-white"
          >
            System Settings
          </TabsTrigger>
        </TabsList>

        {hasUserPermission ? (
          <TabsContent value="users" className="mt-4">
            <UserManagement />
          </TabsContent>
        ) : (
          <TabsContent value="users" className="mt-4">
            <PermissionDenied feature="User Management" />
          </TabsContent>
        )}
        
        {hasExportPermission ? (
          <TabsContent value="export" className="mt-4">
            <DataExport />
          </TabsContent>
        ) : (
          <TabsContent value="export" className="mt-4">
            <PermissionDenied feature="Data Export" />
          </TabsContent>
        )}
        
        {hasSettingsPermission ? (
          <TabsContent value="settings" className="mt-4">
            <SystemSettings />
          </TabsContent>
        ) : (
          <TabsContent value="settings" className="mt-4">
            <PermissionDenied feature="System Settings" />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

// Component to display when permission is denied
const PermissionDenied = ({ feature }: { feature: string }) => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center">
      <div className="flex justify-center mb-4">
        <AlertCircle className="h-12 w-12 text-amber-500" />
      </div>
      <h3 className="text-xl font-semibold text-amber-800 mb-2">Permission Required</h3>
      <p className="text-amber-700">
        You don't have permission to access the {feature} feature.
        Please contact a system administrator if you need access.
      </p>
    </div>
  );
};
