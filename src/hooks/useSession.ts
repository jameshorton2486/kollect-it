
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function useSession() {
  const navigate = useNavigate();

  useEffect(() => {
    const trackSession = async (session: any) => {
      if (!session?.user) return;

      const { error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: session.user.id,
          refresh_token: session.refresh_token,
          expires_at: new Date(session.expires_at!).toISOString(), // Convert Date to ISO string
          user_agent: navigator.userAgent,
        });

      if (error) {
        console.error('Error tracking session:', error);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        await trackSession(session);
      } else if (event === 'SIGNED_OUT') {
        // Cleanup old sessions
        if (session?.user) {
          const { error } = await supabase
            .from('user_sessions')
            .delete()
            .eq('user_id', session.user.id);

          if (error) {
            console.error('Error cleaning up sessions:', error);
          }
        }
        navigate('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
}
