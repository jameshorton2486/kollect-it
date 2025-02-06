
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export function useInactivityTimeout() {
  const navigate = useNavigate();

  useEffect(() => {
    let inactivityTimer: number;

    const resetInactivityTimer = () => {
      window.clearTimeout(inactivityTimer);
      inactivityTimer = window.setTimeout(async () => {
        console.log("User inactive for too long, signing out...");
        await supabase.auth.signOut();
        toast.info("You've been logged out due to inactivity");
        navigate("/auth");
      }, INACTIVITY_TIMEOUT);
    };

    // Reset timer on user activity
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      document.addEventListener(event, resetInactivityTimer);
    });

    // Initial setup
    resetInactivityTimer();

    // Cleanup
    return () => {
      window.clearTimeout(inactivityTimer);
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [navigate]);
}
