
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function useSession() {
  const navigate = useNavigate();

  useEffect(() => {
    const trackSession = async (session: any) => {
      console.log("Tracking session for user:", session?.user?.id);
      
      if (!session?.user) {
        console.warn("No user found in session");
        return;
      }

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

        console.log("Collected device info:", deviceInfo);

        // Default GDPR consent values - in a real app, these should come from user input
        const gdprConsent = {
          analytics: true,
          marketing: false,
          necessary: true,
          preferences: true,
          timestamp: new Date().toISOString()
        };

        console.log("Creating session record in database");

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
        } else {
          console.log("Session successfully tracked");
        }
      } catch (err) {
        console.error('Session tracking error:', err);
        toast.error('Unable to establish secure session. Please try again.');
      }
    };

    // Update session activity periodically
    const updateActivity = async (sessionId: string) => {
      console.log("Updating session activity:", sessionId);
      
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
        } else {
          console.log("Session activity updated successfully");
        }
      } catch (err) {
        console.error('Session activity update error:', err);
      }
    };

    // Set up activity tracking interval
    let activityInterval: NodeJS.Timeout;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, 'for user:', session?.user?.id);
      
      if (event === 'SIGNED_IN') {
        console.log("User signed in, initializing session tracking");
        await trackSession(session);
        toast.success('Successfully authenticated!');
        
        // Start tracking activity
        if (session?.access_token) {
          console.log("Starting activity tracking interval");
          activityInterval = setInterval(() => {
            updateActivity(session.access_token);
          }, 5 * 60 * 1000); // Update every 5 minutes
        }
      } else if (['SIGNED_OUT', 'USER_DELETED'].includes(event)) {
        console.log("User signed out or deleted, cleaning up session");
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
          // Clear activity tracking
          if (activityInterval) {
            console.log("Clearing activity tracking interval");
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
      console.log("Cleaning up session hook");
      subscription.unsubscribe();
      if (activityInterval) {
        clearInterval(activityInterval);
      }
    };
  }, [navigate]);
}

