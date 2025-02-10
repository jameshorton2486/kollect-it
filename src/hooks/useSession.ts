
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function useSession() {
  const navigate = useNavigate();

  useEffect(() => {
    const trackSession = async (session: any) => {
      if (!session?.user) return;

      try {
        // Get device and browser information
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

        // Default GDPR consent values - in a real app, these should come from user input
        const gdprConsent = {
          analytics: true,
          marketing: false,
          necessary: true,
          preferences: true,
          timestamp: new Date().toISOString()
        };

        const { error } = await supabase
          .from('user_sessions')
          .insert({
            user_id: session.user.id,
            refresh_token: session.refresh_token,
            expires_at: new Date(session.expires_at!).toISOString(),
            user_agent: navigator.userAgent,
            ip_address: '', // IP is handled server-side for security
            is_active: true,
            device_info: deviceInfo,
            last_active: new Date().toISOString(),
            compliance_accepted: true,
            gdpr_consent: gdprConsent,
            session_metadata: {
              login_timestamp: new Date().toISOString(),
              auth_method: 'email',
              last_activity_type: 'login'
            }
          });

        if (error) {
          console.error('Error tracking session:', error);
          toast.error('Session tracking failed. Please try logging in again.');
        }
      } catch (err) {
        console.error('Session tracking error:', err);
        toast.error('Unable to establish secure session. Please try again.');
      }
    };

    // Update session activity periodically
    const updateActivity = async (sessionId: string) => {
      try {
        const { error } = await supabase
          .from('user_sessions')
          .update({ 
            last_active: new Date().toISOString(),
            session_metadata: {
              last_activity_type: 'heartbeat',
              last_activity_timestamp: new Date().toISOString()
            }
          })
          .eq('id', sessionId);

        if (error) {
          console.error('Error updating session activity:', error);
        }
      } catch (err) {
        console.error('Session activity update error:', err);
      }
    };

    // Set up activity tracking interval
    let activityInterval: NodeJS.Timeout;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN') {
        await trackSession(session);
        toast.success('Successfully authenticated!');
        
        // Start tracking activity
        if (session?.access_token) {
          activityInterval = setInterval(() => {
            updateActivity(session.access_token);
          }, 5 * 60 * 1000); // Update every 5 minutes
        }
      } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        try {
          if (session?.user) {
            const { error } = await supabase
              .from('user_sessions')
              .update({ 
                is_active: false,
                session_metadata: {
                  last_activity_type: 'logout',
                  logout_timestamp: new Date().toISOString()
                }
              })
              .eq('user_id', session.user.id);

            if (error) {
              console.error('Error cleaning up sessions:', error);
            }
          }
          toast.info('You have been signed out successfully');
          navigate('/auth');
        } catch (err) {
          console.error('Sign out error:', err);
          toast.error('Error during sign out. Please try again.');
        } finally {
          // Clear activity tracking
          if (activityInterval) {
            clearInterval(activityInterval);
          }
        }
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Session token refreshed');
        // Update session metadata
        if (session?.access_token) {
          await updateActivity(session.access_token);
        }
      }
    });

    // Cleanup function
    return () => {
      subscription.unsubscribe();
      if (activityInterval) {
        clearInterval(activityInterval);
      }
    };
  }, [navigate]);
}
