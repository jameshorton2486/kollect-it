
import { supabase } from '@/integrations/supabase/client';
import type { SessionData } from '@/types/session';

export class SessionService {
  static async createOrUpdateSession(sessionData: SessionData) {
    return await supabase
      .from('user_sessions')
      .upsert(sessionData, {
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
        session_metadata: metadata
      })
      .eq('user_id', userId)
      .eq('is_active', true)
      .eq('session_status', 'active');
  }

  static async terminateSession(userId: string, reason: string) {
    return await supabase
      .from('user_sessions')
      .update({ 
        is_active: false,
        session_status: 'terminated',
        session_metadata: {
          last_activity_type: 'logout',
          logout_timestamp: new Date().toISOString(),
          termination_reason: reason
        }
      })
      .eq('user_id', userId)
      .eq('is_active', true)
      .eq('session_status', 'active');
  }

  static async updateSessionError(userId: string, error: Record<string, unknown>, retryCount: number) {
    return await supabase
      .from('user_sessions')
      .update({ 
        last_error: error,
        retry_count: retryCount,
        last_retry_at: new Date().toISOString()
      })
      .eq('user_id', userId);
  }
}
