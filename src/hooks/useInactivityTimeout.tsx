
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Increase timeout to 2 hours (in milliseconds)
const INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours
const WARNING_TIMEOUT = INACTIVITY_TIMEOUT - (5 * 60 * 1000); // Show warning 5 minutes before timeout

export function useInactivityTimeout() {
  const navigate = useNavigate();

  useEffect(() => {
    let inactivityTimer: number;
    let warningTimer: number;
    let warningShown = false;

    const resetInactivityTimer = () => {
      window.clearTimeout(inactivityTimer);
      window.clearTimeout(warningTimer);
      warningShown = false;

      // Set warning timer
      warningTimer = window.setTimeout(() => {
        if (!warningShown) {
          warningShown = true;
          toast.warning(
            "Your session will expire soon due to inactivity. Move your mouse or press any key to stay signed in.",
            { duration: 10000 } // Show for 10 seconds
          );
        }
      }, WARNING_TIMEOUT);

      // Set main inactivity timer
      inactivityTimer = window.setTimeout(async () => {
        console.log("User inactive for too long, signing out...");
        await supabase.auth.signOut();
        toast.info("You've been signed out due to inactivity");
        navigate("/auth");
      }, INACTIVITY_TIMEOUT);
    };

    // Reset timer on user activity
    const activityEvents = [
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
      'mousemove'
    ];

    activityEvents.forEach(event => {
      document.addEventListener(event, resetInactivityTimer);
    });

    // Initial setup
    resetInactivityTimer();

    // Cleanup
    return () => {
      window.clearTimeout(inactivityTimer);
      window.clearTimeout(warningTimer);
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [navigate]);
}
