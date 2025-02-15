
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SessionService } from '@/services/sessionService';

export function useAuthStateManager() {
  const navigate = useNavigate();

  const handleSignOut = useCallback(async (
    userId: string,
    reason: string,
    clearInterval?: () => void
  ) => {
    try {
      const { error } = await SessionService.terminateSession(userId, reason);

      if (error) {
        console.error('Error cleaning up sessions:', error);
        return false;
      }
      
      console.log("Session cleanup successful");
      toast.info('You have been signed out successfully');
      navigate('/auth');
      return true;
    } catch (err) {
      console.error('Sign out error:', err);
      toast.error('Error during sign out. Please try again.');
      return false;
    } finally {
      if (clearInterval) {
        clearInterval();
      }
    }
  }, [navigate]);

  return { handleSignOut };
}
