import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { UsageAnalytics } from "@/components/UsageAnalytics";
import { UsageHistory } from "@/components/UsageHistory";
import { AffiliateEarnings } from "@/components/AffiliateEarnings";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell, Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Dashboard = () => {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState<string>("");
  const { toast: uiToast } = useToast();
  const [bankAccount, setBankAccount] = useState("**** 1234");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const userStr = localStorage.getItem('affiliateUser');
      if (!userStr) {
        uiToast({
          title: "Authentication Required",
          description: "Please log in to access the dashboard",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      try {
        const user = JSON.parse(userStr);
        if (!user.coupon_code) {
          throw new Error("Invalid user data");
        }
        setCouponCode(user.coupon_code);
        
        // Show welcome notification
        toast.success("Welcome back!", {
          description: "Your dashboard is ready to view",
        });
        
        // Show mock notifications
        setTimeout(() => {
          toast("New coupon redemption!", {
            description: "Your code was just used for a $75 purchase",
          });
        }, 2000);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem('affiliateUser');
        uiToast({
          title: "Error",
          description: "Session expired. Please log in again",
          variant: "destructive",
        });
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate, uiToast]);

  const handleLogout = () => {
    localStorage.removeItem('affiliateUser');
    uiToast({
      title: "Success",
      description: "Successfully logged out",
    });
    navigate('/login');
  };

  const handleSaveSettings = () => {
    // In a real app, this would make an API call to save the settings
    toast.success("Settings saved successfully!");
  };

  if (!couponCode) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onLogout={handleLogout} />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Track your affiliate performance and earnings
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Notifications</DialogTitle>
                  <DialogDescription>
                    Recent activity for your affiliate account
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="font-medium">New Redemption</h3>
                    <p className="text-sm text-muted-foreground">
                      Your code was used for a $75 purchase at 2:30 PM
                    </p>
                  </div>
                  <div className="border-b pb-4">
                    <h3 className="font-medium">Payout Processed</h3>
                    <p className="text-sm text-muted-foreground">
                      Your monthly earnings of $1,250 have been sent
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Performance Milestone</h3>
                    <p className="text-sm text-muted-foreground">
                      You've reached 100 redemptions this month!
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Account Settings</DialogTitle>
                  <DialogDescription>
                    Manage your affiliate account preferences
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Your Coupon Code</h3>
                    <p className="text-sm text-muted-foreground">{couponCode}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Payout Information</h3>
                    <div className="space-y-2">
                      <Label htmlFor="bankAccount">Bank Account Number</Label>
                      <Input
                        id="bankAccount"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        placeholder="Enter bank account number"
                      />
                      <p className="text-sm text-muted-foreground">
                        This is where your monthly earnings will be sent
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Notification Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive updates about your earnings via email
                          </p>
                        </div>
                        <Switch
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Get instant updates in your browser
                          </p>
                        </div>
                        <Switch
                          checked={pushNotifications}
                          onCheckedChange={setPushNotifications}
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSaveSettings} className="w-full">
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="space-y-6">
          <AffiliateEarnings />
          <UsageAnalytics couponCode={couponCode} />
          <UsageHistory />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
