
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { SessionService } from '@/services/sessionService';
import { getDeviceInfo } from '@/utils/deviceInfo';
import type { SessionData, SessionMetadata, SessionError } from '@/types/session';

export function useSession() {
  const navigate = useNavigate();
  const { session: authSession } = useAuth();

  useEffect(() => {
    let mounted = true;
    let activityInterval: NodeJS.Timeout;
    let retryCount = 0;
    const MAX_RETRIES = 3;

    const trackSession = async (session: any) => {
      if (!mounted || !session?.user) {
        console.log("No valid session to track");
        return;
      }

      try {
        const sessionData: SessionData = {
          user_id: session.user.id,
          refresh_token: session.refresh_token,
          expires_at: new Date(session.expires_at!).toISOString(),
          user_agent: navigator.userAgent,
          ip_address: '', // Handled server-side
          is_active: true,
          session_status: 'active',
          device_info: getDeviceInfo(),
          last_active: new Date().toISOString(),
          retry_count: 0,
          last_error: null,
          compliance_accepted: true,
          gdpr_consent: {
            analytics: true,
            marketing: false,
            necessary: true,
            preferences: true,
            timestamp: new Date().toISOString()
          },
          session_metadata: {
            login_timestamp: new Date().toISOString(),
            auth_method: 'email',
            last_activity_type: 'login'
          }
        };

        const { error } = await SessionService.createOrUpdateSession(sessionData);

        if (error) {
          console.error('Error tracking session:', error);
          const sessionError: SessionError = {
            code: error.code,
            message: error.message,
            timestamp: new Date().toISOString()
          };

          await SessionService.updateSessionError(
            session.user.id,
            sessionError,
            retryCount + 1
          );

          if (mounted) {
            toast.error('Session tracking failed. Please try logging in again.');
          }
        } else {
          console.log("Session successfully tracked");
          retryCount = 0;
        }
      } catch (err) {
        console.error('Session tracking error:', err);
        if (mounted) {
          toast.error('Unable to establish secure session. Please try again.');
        }
      }
    };

    const updateActivity = async () => {
      if (!mounted || !authSession?.user?.id) return;
      
      try {
        const metadata: SessionMetadata = {
          last_activity_type: 'heartbeat',
          last_activity_timestamp: new Date().toISOString()
        };

        const { error } = await SessionService.updateSessionActivity(
          authSession.user.id,
          metadata
        );

        if (error) {
          console.error('Error updating session activity:', error);
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            setTimeout(updateActivity, 1000 * retryCount);
          }
        } else {
          console.log("Session activity updated successfully");
          retryCount = 0;
        }
      } catch (err) {
        console.error('Session activity update error:', err);
      }
    };

    let unsubscribe: any;

    const setupAuthListener = async () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, 'for user:', session?.user?.id);
        
        if (event === 'SIGNED_IN') {
          await trackSession(session);
          toast.success('Successfully authenticated!');
          
          if (session?.user?.id) {
            activityInterval = setInterval(updateActivity, 5 * 60 * 1000);
          }
        } else if (['SIGNED_OUT', 'USER_DELETED'].includes(event)) {
          try {
            if (session?.user?.id) {
              const { error } = await SessionService.terminateSession(
                session.user.id,
                event
              );

              if (error) {
                console.error('Error cleaning up sessions:', error);
              } else {
                console.log("Session cleanup successful");
              }
            }
            toast.info('You have been signed out successfully');
            navigate('/auth');
          } catch (err) {
            console.error('Sign out error:', err);
            toast.error('Error during sign out. Please try again.');
          } finally {
            if (activityInterval) {
              clearInterval(activityInterval);
            }
          }
        }
      });

      unsubscribe = subscription.unsubscribe;
    };

    if (authSession?.user) {
      trackSession(authSession);
      setupAuthListener();
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
  }, [navigate, authSession]);
}
