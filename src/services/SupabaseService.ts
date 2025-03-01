
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

class SupabaseService {
  private lastConnectivityCheck: number = 0;
  private connectivityCheckInterval: number = 30000; // 30 seconds
  private isOnline: boolean = true;
  
  constructor() {
    // Initialize connectivity monitoring
    this.monitorConnectivity();
    
    // Set up event listeners for online/offline status
    window.addEventListener('online', () => this.handleOnlineStatus(true));
    window.addEventListener('offline', () => this.handleOnlineStatus(false));
  }
  
  private handleOnlineStatus(online: boolean) {
    if (this.isOnline !== online) {
      this.isOnline = online;
      if (online) {
        toast.success("Connection restored", { 
          description: "You're back online. Data will now sync with the server."
        });
      } else {
        toast.error("Connection lost", { 
          description: "You're currently offline. Some features may be limited."
        });
      }
    }
  }
  
  private async monitorConnectivity() {
    try {
      // Only check connectivity if enough time has passed since last check
      const now = Date.now();
      if (now - this.lastConnectivityCheck < this.connectivityCheckInterval) {
        return;
      }
      
      this.lastConnectivityCheck = now;
      
      // Simple health check query
      const { error } = await supabase.from('thg_affiliate_users').select('count(*)', { count: 'exact', head: true });
      
      // Update connectivity status based on response
      this.handleOnlineStatus(!error);
      
    } catch (error) {
      this.handleOnlineStatus(false);
    }
    
    // Schedule next check
    setTimeout(() => this.monitorConnectivity(), this.connectivityCheckInterval);
  }
  
  /**
   * Performs a Supabase query with enhanced error handling and connectivity checks
   */
  async safeQuery<T>(queryFn: () => Promise<T>, fallbackValue: T, errorMessage: string): Promise<T> {
    if (!this.isOnline) {
      toast.error("Offline mode", { 
        description: "Using cached data. Some information may not be up to date."
      });
      return fallbackValue;
    }
    
    try {
      const result = await queryFn();
      return result;
    } catch (error) {
      console.error("Supabase query error:", error);
      
      if (error instanceof Error) {
        toast.error("Data fetch error", { description: error.message });
      } else {
        toast.error("Data fetch error", { description: errorMessage });
      }
      
      return fallbackValue;
    }
  }
}

export const supabaseService = new SupabaseService();
