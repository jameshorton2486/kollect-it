import { Link } from "react-router-dom";
import { KeyRound } from "lucide-react";

export function AuthLoginExtras() {
  return (
    <div className="flex items-center justify-between text-sm">
      <Link
        to="/password-recovery"
        className="text-primary hover:underline inline-flex items-center"
      >
        <KeyRound className="mr-1 h-3 w-3" />
        Forgot password?
      </Link>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="remember"
          className="rounded border-gray-300"
        />
        <label htmlFor="remember" className="text-muted-foreground">
          Remember me
        </label>
      </div>
    </div>
  );
}