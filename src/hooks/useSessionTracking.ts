
import { useCallback } from 'react';
import { toast } from 'sonner';
import { SessionService } from '@/services/sessionService';
import { getDeviceInfo } from '@/utils/deviceInfo';
import type { SessionData, SessionError } from '@/types/session';

export function useSessionTracking() {
  const trackSession = useCallback(async (session: any, mounted: boolean) => {
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
        ip_address: '',
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
          0
        );

        if (mounted) {
          toast.error('Session tracking failed. Please try logging in again.');
        }
        return false;
      }
      
      console.log("Session successfully tracked");
      return true;
    } catch (err) {
      console.error('Session tracking error:', err);
      if (mounted) {
        toast.error('Unable to establish secure session. Please try again.');
      }
      return false;
    }
  }, []);

  return { trackSession };
}
