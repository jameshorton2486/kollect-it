
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface SessionError {
  code: string;
  message: string;
  timestamp: string;
}

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
        const deviceInfo = {
          platform: navigator.platform,
          userAgent: navigator.userAgent,
          language: navigator.language,
          cookiesEnabled: navigator.cookieEnabled,
          screenResolution: {
            width: window.screen.width,
            height: window.screen.height
          }
        };

        const sessionData = {
          user_id: session.user.id,
          refresh_token: session.refresh_token,
          expires_at: new Date(session.expires_at!).toISOString(),
          user_agent: navigator.userAgent,
          ip_address: '', // Handled server-side
          is_active: true,
          session_status: 'active',
          device_info: deviceInfo,
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

        const { error } = await supabase
          .from('user_sessions')
          .upsert(sessionData, {
            onConflict: 'user_id',
            ignoreDuplicates: false
          });

        if (error) {
          console.error('Error tracking session:', error);
          const sessionError: SessionError = {
            code: error.code,
            message: error.message,
            timestamp: new Date().toISOString()
          };

          await supabase
            .from('user_sessions')
            .update({ 
              last_error: sessionError,
              retry_count: retryCount + 1,
              last_retry_at: new Date().toISOString()
            })
            .eq('user_id', session.user.id);

          if (mounted) {
            toast.error('Session tracking failed. Please try logging in again.');
          }
        } else {
          console.log("Session successfully tracked");
          retryCount = 0; // Reset retry count on success
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
        const { error } = await supabase
          .from('user_sessions')
          .update({ 
            last_active: new Date().toISOString(),
            session_status: 'active',
            session_metadata: {
              last_activity_type: 'heartbeat',
              last_activity_timestamp: new Date().toISOString()
            }
          })
          .eq('user_id', authSession.user.id)
          .eq('is_active', true)
          .eq('session_status', 'active');

        if (error) {
          console.error('Error updating session activity:', error);
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            setTimeout(updateActivity, 1000 * retryCount); // Exponential backoff
          }
        } else {
          console.log("Session activity updated successfully");
          retryCount = 0; // Reset retry count on success
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
              const { error } = await supabase
                .from('user_sessions')
                .update({ 
                  is_active: false,
                  session_status: 'terminated',
                  session_metadata: {
                    last_activity_type: 'logout',
                    logout_timestamp: new Date().toISOString(),
                    termination_reason: event
                  }
                })
                .eq('user_id', session.user.id)
                .eq('is_active', true)
                .eq('session_status', 'active');

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
