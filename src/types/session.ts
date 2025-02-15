
import type { Json } from '@/integrations/supabase/types';

export interface DeviceInfo {
  platform: string;
  userAgent: string;
  language: string;
  cookiesEnabled: boolean;
  screenResolution: {
    width: number;
    height: number;
  };
  [key: string]: unknown; // Add index signature for Json compatibility
}

export interface GDPRConsent {
  analytics: boolean;
  marketing: boolean;
  necessary: boolean;
  preferences: boolean;
  timestamp: string;
  [key: string]: unknown; // Add index signature for Json compatibility
}

export interface SessionMetadata {
  login_timestamp?: string;
  auth_method?: string;
  last_activity_type?: string;
  last_activity_timestamp?: string;
  logout_timestamp?: string;
  termination_reason?: string;
  expiry_reason?: string;
  [key: string]: unknown; // Add index signature for Json compatibility
}

export interface SessionData {
  user_id: string;
  refresh_token: string;
  expires_at: string;
  user_agent: string;
  ip_address: string;
  is_active: boolean;
  session_status: 'active' | 'expired' | 'terminated';
  device_info: DeviceInfo;
  last_active: string;
  retry_count: number;
  last_error: Record<string, unknown> | null;
  compliance_accepted: boolean;
  gdpr_consent: GDPRConsent;
  session_metadata: SessionMetadata;
}

export interface SessionError {
  code: string;
  message: string;
  timestamp: string;
  [key: string]: unknown; // Add index signature for Json compatibility
}
