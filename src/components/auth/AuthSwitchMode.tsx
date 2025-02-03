import { Button } from "@/components/ui/button";

interface AuthSwitchModeProps {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
}

export function AuthSwitchMode({ isLogin, setIsLogin }: AuthSwitchModeProps) {
  return (
    <div className="mt-6 text-center">
      <Button
        type="button"
        variant="ghost"
        onClick={() => setIsLogin(!isLogin)}
        className="text-sm text-primary hover:underline"
      >
        {isLogin
          ? "New to collecting? Start your journey!"
          : "Already a collector? Sign in"}
      </Button>
    </div>
  );
}