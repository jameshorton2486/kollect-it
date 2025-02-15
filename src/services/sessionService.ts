
import { supabase } from '@/integrations/supabase/client';
import type { SessionData, SessionMetadata, SessionError } from '@/types/session';
import type { Json } from '@/integrations/supabase/types';

export class SessionService {
  static async createOrUpdateSession(sessionData: SessionData) {
    // Convert the session data to be compatible with Supabase's Json type
    const dbSessionData = {
      ...sessionData,
      device_info: sessionData.device_info as Json,
      gdpr_consent: sessionData.gdpr_consent as Json,
      session_metadata: sessionData.session_metadata as Json,
      last_error: sessionData.last_error as Json
    };

    return await supabase
      .from('user_sessions')
      .upsert(dbSessionData, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      });
  }

  static async updateSessionActivity(userId: string, metadata: SessionMetadata) {
    return await supabase
      .from('user_sessions')
      .update({ 
        last_active: new Date().toISOString(),
        session_status: 'active',
        session_metadata: metadata as Json
      })
      .eq('user_id', userId)
      .eq('is_active', true)
      .eq('session_status', 'active');
  }

  static async terminateSession(userId: string, reason: string) {
    const metadata: SessionMetadata = {
      last_activity_type: 'logout',
      logout_timestamp: new Date().toISOString(),
      termination_reason: reason
    };

    return await supabase
      .from('user_sessions')
      .update({ 
        is_active: false,
        session_status: 'terminated',
        session_metadata: metadata as Json
      })
      .eq('user_id', userId)
      .eq('is_active', true)
      .eq('session_status', 'active');
  }

  static async updateSessionError(userId: string, error: SessionError, retryCount: number) {
    return await supabase
      .from('user_sessions')
      .update({ 
        last_error: error as Json,
        retry_count: retryCount,
        last_retry_at: new Date().toISOString()
      })
      .eq('user_id', userId);
  }
}
