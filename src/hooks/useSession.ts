
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useSessionTracking } from './useSessionTracking';
import { useActivityMonitor } from './useActivityMonitor';
import { useAuthStateManager } from './useAuthStateManager';

export function useSession() {
  const { session: authSession } = useAuth();
  const { trackSession } = useSessionTracking();
  const { updateActivity } = useActivityMonitor();
  const { handleSignOut } = useAuthStateManager();

  useEffect(() => {
    let mounted = true;
    let activityInterval: NodeJS.Timeout;
    let retryCount = 0;
    const MAX_RETRIES = 3;

    const setupAuthListener = async () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, 'for user:', session?.user?.id);
        
        if (event === 'SIGNED_IN') {
          const success = await trackSession(session, mounted);
          
          if (success && session?.user?.id) {
            toast.success('Successfully authenticated!');
            activityInterval = setInterval(() => {
              updateActivity(session.user.id, mounted, retryCount, MAX_RETRIES).then(success => {
                if (success) {
                  retryCount = 0;
                } else {
                  retryCount++;
                }
              });
            }, 5 * 60 * 1000);
          }
        } else if (['SIGNED_OUT', 'USER_DELETED'].includes(event) && session?.user?.id) {
          await handleSignOut(
            session.user.id,
            event,
            () => {
              if (activityInterval) {
                clearInterval(activityInterval);
              }
            }
          );
        }
      });

      return subscription.unsubscribe;
    };

    let unsubscribe: any;
    if (authSession?.user) {
      trackSession(authSession, mounted);
      setupAuthListener().then(unsub => {
        unsubscribe = unsub;
      });
    }

    return () => {
      mounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
      if (activityInterval) {
        clearInterval(activityInterval);
      }
    };
  }, [authSession, trackSession, updateActivity, handleSignOut]);
}
