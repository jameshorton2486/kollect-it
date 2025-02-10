
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
        const { error } = await supabase
          .from('user_sessions')
          .insert({
            user_id: session.user.id,
            refresh_token: session.refresh_token,
            expires_at: new Date(session.expires_at!).toISOString(),
            user_agent: navigator.userAgent,
            ip_address: '',  // IP is handled server-side for security
            is_active: true
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN') {
        await trackSession(session);
        toast.success('Successfully authenticated!');
      } else if (event === 'SIGNED_OUT') {
        try {
          if (session?.user) {
            const { error } = await supabase
              .from('user_sessions')
              .update({ is_active: false })
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
        }
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Session token refreshed');
      } else if (event === 'USER_DELETED') {
        toast.error('Your account has been deleted');
        navigate('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
}
