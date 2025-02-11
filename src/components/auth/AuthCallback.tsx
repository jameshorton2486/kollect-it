
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader } from '@/components/ui/loader';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log("Starting auth callback handling");
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth callback error:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/auth');
        return;
      }

      if (session) {
        console.log("Session obtained successfully:", {
          userId: session.user.id,
          email: session.user.email,
          lastSignIn: session.user.last_sign_in_at
        });

        // Check if email is verified when that setting is enabled
        if (!session.user.email_confirmed_at) {
          console.log("Email not verified yet");
          toast.warning("Please verify your email to complete the login process");
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
          toast.error('Error fetching user roles');
          return;
        }

        const isAdmin = roles?.some(r => r.role === 'admin');
        console.log("User roles fetched:", { roles, isAdmin });
        
        toast.success(`Welcome${isAdmin ? ' Administrator' : ''}! You've successfully logged in.`);
        
        if (isAdmin) {
          navigate('/admin-dashboard');
        } else {
          navigate('/');
        }
      } else {
        console.warn("No session found in callback");
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

