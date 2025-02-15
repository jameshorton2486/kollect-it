
import { useCallback } from 'react';
import { SessionService } from '@/services/sessionService';
import type { SessionMetadata } from '@/types/session';

export function useActivityMonitor() {
  const updateActivity = useCallback(async (
    userId: string, 
    mounted: boolean,
    retryCount: number,
    maxRetries: number = 3
  ) => {
    if (!mounted || !userId) return false;
    
    try {
      const metadata: SessionMetadata = {
        last_activity_type: 'heartbeat',
        last_activity_timestamp: new Date().toISOString()
      };

      const { error } = await SessionService.updateSessionActivity(
        userId,
        metadata
      );

      if (error) {
        console.error('Error updating session activity:', error);
        if (retryCount < maxRetries) {
          return false;
        }
      }
      
      console.log("Session activity updated successfully");
      return true;
    } catch (err) {
      console.error('Session activity update error:', err);
      return false;
    }
  }, []);

  return { updateActivity };
}
