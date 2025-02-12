
export interface AuthAttempt {
  id: string;
  user_id: string | null;
  ip_address: string;
  user_agent: string | null;
  success: boolean;
  failure_reason: string | null;
  attempted_at: string;
  created_at: string;
}

export interface MFAState {
  isEnabled: boolean;
  isChallenging: boolean;
  isVerifying: boolean;
}
