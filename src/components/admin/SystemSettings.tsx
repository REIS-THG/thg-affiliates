
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Save, Settings, ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const SystemSettings = () => {
  // System settings states
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [notificationFrequency, setNotificationFrequency] = useState("daily");
  const [adminEmail, setAdminEmail] = useState("");
  const [alertThreshold, setAlertThreshold] = useState("");
  const [maxFileSize, setMaxFileSize] = useState("5");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Security settings states
  const [passwordMinLength, setPasswordMinLength] = useState("8");
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");
  const [requireSpecialChar, setRequireSpecialChar] = useState(true);
  const [ipRestriction, setIpRestriction] = useState(false);
  const [allowedIPs, setAllowedIPs] = useState("");

  useEffect(() => {
    // In a real application, these settings would be loaded from the database
    // For now, we'll just simulate loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      // Mock data for demonstration
      setEmailEnabled(true);
      setNotificationFrequency("daily");
      setAdminEmail("admin@example.com");
      setAlertThreshold("1000");
      setMaxFileSize("5");
      setMaintenanceMode(false);
      
      setPasswordMinLength("8");
      setSessionTimeout("60");
      setMaxLoginAttempts("5");
      setRequireSpecialChar(true);
      setIpRestriction(false);
      setAllowedIPs("");
    }, 1000);
  }, []);

  const handleSaveSystemSettings = () => {
    // In a real application, these settings would be saved to the database
    // For now, we'll just simulate saving
    toast.success("System settings saved successfully!");
  };

  const handleSaveSecuritySettings = () => {
    // In a real application, these settings would be saved to the database
    // For now, we'll just simulate saving
    toast.success("Security settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="general" className="flex-1">
            General Settings
          </TabsTrigger>
          <TabsTrigger value="security" className="flex-1">
            Security Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertTitle>System Settings</AlertTitle>
            <AlertDescription>
              These settings control the overall behavior of the affiliate system.
              Changes will apply to all users.
            </AlertDescription>
          </Alert>
          
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when notifications are sent to affiliates and administrators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-pulse text-[#3B751E]">Loading settings...</div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable or disable all email notifications
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailEnabled}
                      onCheckedChange={setEmailEnabled}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="notification-frequency">Default Notification Frequency</Label>
                    <Select 
                      value={notificationFrequency} 
                      onValueChange={setNotificationFrequency}
                      disabled={!emailEnabled}
                    >
                      <SelectTrigger id="notification-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Notification Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@example.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      disabled={!emailEnabled}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Limits & Performance</CardTitle>
              <CardDescription>
                Configure system limits and performance settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-pulse text-[#3B751E]">Loading settings...</div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="alert-threshold">Earnings Alert Threshold ($)</Label>
                    <Input
                      id="alert-threshold"
                      type="number"
                      placeholder="1000"
                      value={alertThreshold}
                      onChange={(e) => setAlertThreshold(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      System will alert admins when an affiliate exceeds this amount in unpaid earnings
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max-file-size">Maximum CSV Import Size (MB)</Label>
                    <Input
                      id="max-file-size"
                      type="number"
                      placeholder="5"
                      value={maxFileSize}
                      onChange={(e) => setMaxFileSize(e.target.value)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        When enabled, only administrators can access the system
                      </p>
                    </div>
                    <Switch
                      id="maintenance-mode"
                      checked={maintenanceMode}
                      onCheckedChange={setMaintenanceMode}
                    />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveSystemSettings} 
                className="w-full"
                disabled={isLoading}
              >
                <Save className="mr-2 h-4 w-4" />
                Save System Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Security Settings</AlertTitle>
            <AlertDescription>
              These settings affect the security of your affiliate system. 
              Changes should be made with caution.
            </AlertDescription>
          </Alert>
          
          <Card>
            <CardHeader>
              <CardTitle>Password & Authentication</CardTitle>
              <CardDescription>
                Configure password policies and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-pulse text-[#3B751E]">Loading settings...</div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password-min-length">Minimum Password Length</Label>
                      <Input
                        id="password-min-length"
                        type="number"
                        value={passwordMinLength}
                        onChange={(e) => setPasswordMinLength(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Input
                        id="session-timeout"
                        type="number"
                        value={sessionTimeout}
                        onChange={(e) => setSessionTimeout(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                      <Input
                        id="max-login-attempts"
                        type="number"
                        value={maxLoginAttempts}
                        onChange={(e) => setMaxLoginAttempts(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-8">
                      <Switch
                        id="require-special-char"
                        checked={requireSpecialChar}
                        onCheckedChange={setRequireSpecialChar}
                      />
                      <Label htmlFor="require-special-char">Require Special Characters</Label>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="ip-restriction">IP Restriction</Label>
                      <p className="text-sm text-muted-foreground">
                        Limit admin access to specific IP addresses
                      </p>
                    </div>
                    <Switch
                      id="ip-restriction"
                      checked={ipRestriction}
                      onCheckedChange={setIpRestriction}
                    />
                  </div>
                  
                  {ipRestriction && (
                    <div className="space-y-2">
                      <Label htmlFor="allowed-ips">Allowed IP Addresses</Label>
                      <Input
                        id="allowed-ips"
                        placeholder="192.168.1.1, 10.0.0.1"
                        value={allowedIPs}
                        onChange={(e) => setAllowedIPs(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter comma-separated IP addresses that are allowed to access the admin panel
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveSecuritySettings} 
                className="w-full"
                disabled={isLoading}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Security Settings
              </Button>
            </CardFooter>
          </Card>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Recommendation</AlertTitle>
            <AlertDescription>
              For enhanced security, we recommend implementing two-factor authentication and reviewing 
              security logs regularly.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};
