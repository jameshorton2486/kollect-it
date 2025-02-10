import { supabase } from "@/integrations/supabase/client";
import { AuthFormValues } from "@/components/auth/AuthForm";
import { loginSchema, registerSchema } from "@/lib/validations/schemas";
import { AuthError, User, Session, Provider } from '@supabase/supabase-js';
import { MAX_LOGIN_ATTEMPTS, LOCKOUT_DURATION } from "./constants";

/**
 * Handles user login authentication
 * @param values - Object containing login credentials (email and password)
 * @returns Promise resolving to the authenticated user and session
 * @throws Error if login fails or rate limit is exceeded
 */
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

/**
 * Handles new user registration
 * @param values - Object containing registration details (email, password, and optional profile info)
 * @returns Promise resolving to the created user and session
 * @throws Error if registration fails or user already exists
 */
export async function handleSignup(values: AuthFormValues): Promise<{ user: User | null; session: Session | null }> {
  // Validate registration data
  registerSchema.parse(values);

  // First check if user exists using signUp - this is the recommended way
  const { data: userCheck, error: checkError } = await supabase.auth.signUp({
    email: values.email.trim(),
    password: values.password.trim(),
  });

  if (checkError) {
    throw new Error("Unable to create account. Please try again later.");
  }

  // If userCheck.user exists but session is null, the user already exists
  if (userCheck.user && !userCheck.session) {
    throw new Error("Already a collector? Looks like you have an account! Please sign in instead.");
  }

  // If we get here, it's a new signup
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

/**
 * Handles OAuth sign in with supported providers
 * @param provider - The OAuth provider to use (e.g., 'google', 'github')
 * @returns Promise resolving to the OAuth sign in response
 * @throws Error if OAuth sign in fails
 */
export async function handleOAuthSignIn(provider: Provider) {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("OAuth error:", error);
      throw new Error("Failed to sign in with OAuth provider");
    }

    return data;
  } catch (error) {
    console.error("OAuth sign in error:", error);
    throw error;
  }
}
