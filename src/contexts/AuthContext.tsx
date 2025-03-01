
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useErrorContext } from "./ErrorContext";

interface UserType {
  coupon_code: string;
  role: string;
}

interface UserSettings {
  paymentMethod: string;
  paymentDetails: string;
  emailNotifications: boolean;
  notificationEmail: string;
  notificationFrequency: string;
  viewType: string;
}

interface AuthContextType {
  user: UserType | null;
  isLoading: boolean;
  isAdmin: boolean;
  userSettings: UserSettings;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  viewAll: boolean;
  setViewAll: (checked: boolean) => void;
  updateUserSettings: (settings: Partial<UserSettings>) => Promise<void>;
}

const STORAGE_KEY_USER = 'affiliateUser';
const STORAGE_KEY_VIEW_PREFERENCE = 'thg_affiliate_view_preference';

const defaultUserSettings: UserSettings = {
  paymentMethod: "",
  paymentDetails: "",
  emailNotifications: true,
  notificationEmail: "",
  notificationFrequency: "daily",
  viewType: "personal"
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultUserSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [viewAll, setViewAll] = useState(false);
  const navigate = useNavigate();
  const { handleApiError } = useErrorContext();

  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const userStr = localStorage.getItem(STORAGE_KEY_USER);
      if (!userStr) {
        setUser(null);
        return;
      }

      const parsedUser = JSON.parse(userStr);
      if (!parsedUser.coupon_code) {
        throw new Error("Invalid user data");
      }
      
      setUser(parsedUser);
      
      // Load view preference
      const savedViewPreference = localStorage.getItem(STORAGE_KEY_VIEW_PREFERENCE);
      if (savedViewPreference === 'all') {
        setViewAll(true);
      }
      
      // Only fetch affiliate preferences if not an admin
      if (parsedUser.role !== "admin") {
        try {
          const { data: affiliateUser, error } = await supabase
            .from('thg_affiliate_users')
            .select('*')
            .eq('coupon', parsedUser.coupon_code)
            .maybeSingle();

          if (error) {
            console.error("Error fetching user preferences:", error);
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
          handleApiError(fetchError, "Failed to load user preferences");
        }
      }
    } catch (error) {
      handleApiError(error, "Session error");
      localStorage.removeItem(STORAGE_KEY_USER);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const logout = async () => {
    localStorage.removeItem(STORAGE_KEY_USER);
    setUser(null);
    toast.success("Successfully logged out");
    navigate('/login');
  };

  const updateViewPreference = async (checked: boolean) => {
    try {
      const newViewType = checked ? 'all' : 'personal';
      localStorage.setItem(STORAGE_KEY_VIEW_PREFERENCE, newViewType);
      setViewAll(checked);
      setUserSettings(prev => ({ ...prev, viewType: newViewType }));
      toast.success(`Switched to ${checked ? 'all affiliates' : 'personal'} view`);
    } catch (error) {
      handleApiError(error, 'Failed to update view preference');
    }
  };

  const updateUserSettings = async (settings: Partial<UserSettings>) => {
    try {
      setUserSettings(prev => ({ ...prev, ...settings }));
      
      if (!user) return;
      
      // Save to database if not just changing view preference
      if (settings.viewType === undefined) {
        const { error } = await supabase
          .from('thg_affiliate_users')
          .update({
            payment_method: settings.paymentMethod !== undefined ? settings.paymentMethod : userSettings.paymentMethod,
            payment_details: settings.paymentDetails !== undefined ? settings.paymentDetails : userSettings.paymentDetails,
            email_notifications: settings.emailNotifications !== undefined ? settings.emailNotifications : userSettings.emailNotifications,
            notification_email: settings.notificationEmail !== undefined ? settings.notificationEmail : userSettings.notificationEmail,
            notification_frequency: settings.notificationFrequency !== undefined ? settings.notificationFrequency : userSettings.notificationFrequency,
          })
          .eq('coupon', user.coupon_code);
          
        if (error) throw error;
        toast.success("Settings updated successfully");
      }
    } catch (error) {
      handleApiError(error, "Failed to update settings");
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAdmin: user?.role === "admin",
      userSettings,
      logout,
      refreshUser,
      viewAll,
      setViewAll: updateViewPreference,
      updateUserSettings
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
