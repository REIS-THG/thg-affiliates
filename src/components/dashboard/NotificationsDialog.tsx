
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export const NotificationsDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          aria-label="Open notifications"
        >
          <Bell className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background/95">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>
            Recent activity for your affiliate account
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="border-b pb-4" role="article" aria-labelledby="notification-title-1" tabIndex={0}>
            <h3 id="notification-title-1" className="font-medium">New Redemption</h3>
            <p className="text-sm text-muted-foreground">
              Your code was used for a $75 purchase at 2:30 PM
            </p>
          </div>
          <div className="border-b pb-4" role="article" aria-labelledby="notification-title-2" tabIndex={0}>
            <h3 id="notification-title-2" className="font-medium">Payout Processed</h3>
            <p className="text-sm text-muted-foreground">
              Your monthly earnings of $1,250 have been sent
            </p>
          </div>
          <div role="article" aria-labelledby="notification-title-3" tabIndex={0}>
            <h3 id="notification-title-3" className="font-medium">Performance Milestone</h3>
            <p className="text-sm text-muted-foreground">
              You've reached 100 redemptions this month!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
