
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader } from '@/components/ui/loader';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth callback error:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/auth');
        return;
      }

      if (session) {
        // Check if email is verified when that setting is enabled
        if (!session.user.email_confirmed_at) {
          console.log("Email not verified yet");
          navigate("/email-verification");
          return;
        }

        // Fetch user roles
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);

        if (rolesError) {
          console.error("Error fetching user roles:", rolesError);
        }

        const isAdmin = roles?.some(r => r.role === 'admin');
        toast.success(`Welcome${isAdmin ? ' Administrator' : ''}! You've successfully logged in.`);
        navigate(isAdmin ? "/admin" : "/");
      } else {
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader />
    </div>
  );
}
