
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Loader2 } from "lucide-react";

export function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simply redirect to home page, bypassing all auth
    navigate('/');
  }, [navigate]);

  return (
    <AuthLayout>
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Redirecting to app...</span>
      </div>
    </AuthLayout>
  );
}
