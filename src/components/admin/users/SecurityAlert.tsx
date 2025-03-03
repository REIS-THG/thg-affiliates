
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const SecurityAlert = () => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Password Security</AlertTitle>
      <AlertDescription>
        The password will be stored securely. New affiliates should change their password after first login.
      </AlertDescription>
    </Alert>
  );
};
