import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rbdbhelhvefrhcdbicss.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiZGJoZWxodmVmcmhjZGJpY3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxMDM3NDcsImV4cCI6MjA1MzY3OTc0N30.7zKHY4PlCcyDRFGdl2OypCTma3I3cdzZvPc3uSbS-X8";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);