
import { Button } from "@/components/ui/button";

interface AuthSwitchModeProps {
  mode: "login" | "signup" | "guest";
  onChange: (mode: "login" | "signup" | "guest") => void;
}

export function AuthSwitchMode({ mode, onChange }: AuthSwitchModeProps) {
  return (
    <div className="mt-6 text-center">
      <Button
        type="button"
        variant="ghost"
        onClick={() => onChange(mode === "login" ? "signup" : "login")}
        className="text-sm text-primary hover:underline"
      >
        {mode === "login"
          ? "New to collecting? Start your journey!"
          : "Already a collector? Sign in"}
      </Button>
    </div>
  );
}
