import { supabase } from "@/integrations/supabase/client";
import { AuthFormValues } from "@/components/auth/AuthForm";
import { loginSchema, registerSchema } from "@/lib/validations/schemas";
import { AuthError, User, Session, Provider } from '@supabase/supabase-js';
import { MAX_LOGIN_ATTEMPTS, LOCKOUT_DURATION } from "./constants";
import { toast } from "sonner";

/**
 * Handles user login authentication
 * @param values - Object containing login credentials (email and password)
 * @returns Promise resolving to the authenticated user and session
 * @throws Error if login fails or rate limit is exceeded
 */
export async function handleLogin(values: AuthFormValues): Promise<{ user: User | null; session: Session | null }> {
  console.info('Login attempt initiated', { email: values.email });
  
  try {
    loginSchema.parse(values);
    console.debug('Login data validation passed');

    const { data: rateLimitCheck, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        check_ip: 'client-ip',
        check_email: values.email.trim()
      });

    if (rateLimitError) {
      console.error('Rate limit check failed', { error: rateLimitError });
      throw new Error("An error occurred while checking rate limits. Please try again later.");
    }

    if (rateLimitCheck) {
      console.warn('Rate limit exceeded', { email: values.email });
      throw new Error(`Too many failed attempts. Please try again after ${LOCKOUT_DURATION} minutes.`);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email.trim(),
      password: values.password.trim(),
    });

    const { error: logError } = await supabase
      .from('login_attempts')
      .insert({
        ip_address: 'client-ip',
        email: values.email.trim(),
        success: !error
      });
    
    if (logError) {
      console.error('Failed to log login attempt', { error: logError });
    }
    
    if (error) {
      console.error('Login failed', { error: error.message });
      throw new Error("Invalid email or password.");
    }

    console.info('Login successful', { userId: data.user?.id });
    return data;
  } catch (error: any) {
    console.error('Login process failed', { 
      error: error.message,
      stack: error.stack
    });
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred during login.");
  }
}

/**
 * Handles new user registration
 * @param values - Object containing registration details (email, password, and optional profile info)
 * @returns Promise resolving to the created user and session
 * @throws Error if registration fails or user already exists
 */
export async function handleSignup(values: AuthFormValues): Promise<{ user: User | null; session: Session | null }> {
  console.info('Signup attempt initiated', { email: values.email });
  
  try {
    registerSchema.parse(values);
    console.debug('Registration data validation passed');

    const { data: userCheck, error: checkError } = await supabase.auth.signUp({
      email: values.email.trim(),
      password: values.password.trim(),
    });

    if (checkError) {
      console.error('User check failed', { error: checkError });
      throw new Error("Unable to create account. Please try again later.");
    }

    if (userCheck.user && !userCheck.session) {
      console.warn('Attempted to create duplicate account', { email: values.email });
      throw new Error("Already a collector? Looks like you have an account! Please sign in instead.");
    }

    console.log('User check passed', { email: values.email });
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
      console.error('Signup failed', { error: error.message });
      throw new Error("Unable to create account. Please try again later.");
    }

    console.info('Signup successful', { userId: data.user?.id });
    return data;
  } catch (error: any) {
    console.error('Signup process failed', { 
      error: error.message,
      stack: error.stack
    });
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred during signup.");
  }
}

/**
 * Handles OAuth sign in with supported providers
 * @param provider - The OAuth provider to use (e.g., 'google', 'github')
 * @returns Promise resolving to the OAuth sign in response
 * @throws Error if OAuth sign in fails
 */
export async function handleOAuthSignIn(provider: Provider) {
  console.info('OAuth sign in attempt initiated', { provider: provider });
  
  try {
    const redirectTo = `${window.location.origin}/auth/callback`;
    console.log('Redirect URL', { redirectTo: redirectTo });
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });

    if (error) {
      console.error('OAuth error', { error: error.message });
      throw new Error(`Failed to sign in with ${provider}: ${error.message}`);
    }

    console.info('OAuth sign in initiated successfully');
    return data;
  } catch (error: any) {
    console.error('OAuth sign in error', { error: error.message });
    toast.error(`Failed to initiate ${provider} sign in. Please try again.`);
    throw error;
  }
}

// Add type-safe error handling utility
export function isAuthError(error: unknown): error is AuthError {
  return error instanceof Error && 'status' in error;
}

// Add session validation utility
export function isValidSession(session: Session | null): session is Session {
  if (!session) {
    console.warn('No session found');
    return false;
  }
  
  if (!session.user) {
    console.warn('Session has no user');
    return false;
  }
  
  if (!session.access_token) {
    console.warn('Session has no access token');
    return false;
  }
  
  const tokenExpiry = new Date(session.expires_at! * 1000);
  if (tokenExpiry < new Date()) {
    console.warn('Session token is expired');
    return false;
  }
  
  return true;
}
