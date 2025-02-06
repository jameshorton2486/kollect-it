
import { supabase } from "@/integrations/supabase/client";
import { AuthFormValues } from "@/components/auth/AuthForm";
import { loginSchema, registerSchema } from "@/lib/validations/schemas";
import { AuthError, User, Session } from '@supabase/supabase-js';
import { MAX_LOGIN_ATTEMPTS, LOCKOUT_DURATION } from "./constants";

// Define a more specific type for the profiles query result
type Profile = {
  id: string;
  email: string;
};

export async function handleLogin(values: AuthFormValues): Promise<{ user: User | null; session: Session | null }> {
  // Validate login data
  loginSchema.parse(values);

  // Check rate limiting
  const { data: rateLimitCheck, error: rateLimitError } = await supabase
    .rpc('check_rate_limit', {
      check_ip: 'client-ip', // In a real app, you'd get the actual client IP
      check_email: values.email.trim()
    });

  if (rateLimitError) {
    console.error("Rate limit check error:", rateLimitError);
    throw new Error("An error occurred. Please try again later.");
  }

  if (rateLimitCheck) {
    throw new Error(`Too many failed attempts. Please try again after ${LOCKOUT_DURATION} minutes.`);
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: values.email.trim(),
    password: values.password.trim(),
  });

  // Log the attempt
  const { error: logError } = await supabase
    .from('login_attempts')
    .insert({
      ip_address: 'client-ip', // In a real app, you'd get the actual client IP
      email: values.email.trim(),
      success: !error
    });
  
  if (error) {
    // Generic error message to avoid revealing specific details
    throw new Error("Invalid email or password.");
  }

  return data;
}

export async function handleSignup(values: AuthFormValues): Promise<{ user: User | null; session: Session | null }> {
  // Validate registration data
  registerSchema.parse(values);

  // Check if email already exists - use a friendly message
  const { data: existingProfiles, error: queryError } = await supabase
    .from('profiles')
    .select<'profiles', Profile>('id, email')
    .eq('email', values.email.trim());

  if (queryError && queryError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    throw new Error("Unable to create account. Please try again later.");
  }

  if (existingProfiles && existingProfiles.length > 0) {
    throw new Error("Already a collector? Looks like you have an account! Please sign in instead.");
  }

  const { data, error } = await supabase.auth.signUp({
    email: values.email.trim(),
    password: values.password.trim(),
    options: {
      data: {
        first_name: values.firstName?.trim(),
        last_name: values.lastName?.trim(),
      },
    },
  });
  
  if (error) {
    // Generic error message
    throw new Error("Unable to create account. Please try again later.");
  }

  return data;
}
