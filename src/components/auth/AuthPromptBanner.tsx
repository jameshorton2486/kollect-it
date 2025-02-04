import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SignUpModal } from "./SignUpModal";

export function AuthPromptBanner() {
  return (
    <Alert variant="default" className="bg-primary/5 border-primary/20">
      <AlertCircle className="h-4 w-4 text-primary" />
      <AlertDescription className="flex items-center gap-4">
        <span>Create an account to unlock exclusive features and start your collecting journey!</span>
        <SignUpModal />
      </AlertDescription>
    </Alert>
  );
}