
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const STORAGE_KEY_VIEW_PREFERENCE = "thg_affiliate_view_preference";

interface AuthHandlerProps {
  children: (props: {
    couponCode: string;
    isAdmin: boolean;
    viewAll: boolean;
    userSettings: {
      paymentMethod: string;
      paymentDetails: string;
      emailNotifications: boolean;
      notificationEmail: string;
      notificationFrequency: string;
      viewType: string;
    };
    isLoading: boolean;
    handleViewToggle: (checked: boolean) => Promise<void>;
    handleLogout: () => void;
  }) => React.ReactNode;
}

export const AuthHandler = ({ children }: AuthHandlerProps) => {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast: uiToast } = useToast();
  const [viewAll, setViewAll] = useState(false);
  const [userSettings, setUserSettings] = useState({
    paymentMethod: "",
    paymentDetails: "",
    emailNotifications: true,
    notificationEmail: "",
    notificationFrequency: "daily",
    viewType: "personal"
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
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
        setIsAdmin(user.role === "admin");
        
        // Load view preference from localStorage
        const savedViewPreference = localStorage.getItem(STORAGE_KEY_VIEW_PREFERENCE);
        if (savedViewPreference === 'all') {
          setViewAll(true);
          setUserSettings(prev => ({ ...prev, viewType: 'all' }));
        }
        
        // Only fetch affiliate preferences if not an admin
        if (user.role !== "admin") {
          try {
            const { data: affiliateUser, error } = await supabase
              .from('thg_affiliate_users')
              .select('*')
              .eq('coupon', user.coupon_code)
              .maybeSingle();

            if (error) {
              console.error("Error fetching user preferences:", error);
              // Continue with default settings instead of throwing
              console.log("Using default settings due to fetch error");
            } else if (affiliateUser) {
              setUserSettings({
                paymentMethod: affiliateUser.payment_method || '',
                paymentDetails: affiliateUser.payment_details || '',
                emailNotifications: affiliateUser.email_notifications ?? true,
                notificationEmail: affiliateUser.notification_email || '',
                notificationFrequency: affiliateUser.notification_frequency || 'daily',
                viewType: savedViewPreference || 'personal'
              });
            }
          } catch (fetchError) {
            console.error("Fetch error:", fetchError);
            // Continue with default settings
          }
        }
        
        // Show welcome notification
        toast.success("Welcome back!", {
          description: isAdmin ? "Admin dashboard is ready" : "Your dashboard is ready to view",
        });
        
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem('affiliateUser');
        uiToast({
          title: "Error",
          description: "Session expired. Please log in again",
          variant: "destructive",
        });
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, uiToast]);

  const handleViewToggle = async (checked: boolean) => {
    try {
      const newViewType = checked ? 'all' : 'personal';
      
      // Store view preference in localStorage instead of the database
      localStorage.setItem(STORAGE_KEY_VIEW_PREFERENCE, newViewType);

      setViewAll(checked);
      setUserSettings(prev => ({ ...prev, viewType: newViewType }));
      
      toast.success(`Switched to ${checked ? 'all affiliates' : 'personal'} view`);
    } catch (error) {
      console.error('Error updating view preference:', error);
      toast.error('Failed to update view preference');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('affiliateUser');
    uiToast({
      title: "Success",
      description: "Successfully logged out",
    });
    navigate('/login');
  };

  return (
    <>
      {children({
        couponCode,
        isAdmin,
        viewAll,
        userSettings,
        isLoading,
        handleViewToggle,
        handleLogout
      })}
    </>
  );
};
