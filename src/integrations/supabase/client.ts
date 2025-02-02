import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rbdbhelhvefrhcdbicss.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiZGJoZWxodmVmcmhjZGJpY3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc0MjY0NjUsImV4cCI6MjAyMzAwMjQ2NX0.vxJO0eGBOPBqTHXDXoXgwPBPFVQQELU_E0Yl0Gy1_Oc";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);