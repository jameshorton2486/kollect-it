
import { ShieldCheck } from "lucide-react";

interface AuthHeaderProps {
  mode: "login" | "signup" | "guest";
}

export function AuthHeader({ mode }: AuthHeaderProps) {
  return (
    <div className="text-center mb-8">
      <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-4" />
      <h2 className="text-3xl font-bold mb-4">
        {mode === "login" 
          ? "Welcome Back to Your Collection!" 
          : "Begin Your Collecting Journey"}
      </h2>
      <p className="text-muted-foreground mb-6">
        {mode === "login"
          ? "Secure access to your collection, watchlist, and exclusive features awaits."
          : "Join our thriving community of collectors and unlock a world of unique treasures."}
      </p>
    </div>
  );
}
