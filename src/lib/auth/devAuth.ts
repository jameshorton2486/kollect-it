
import { supabase } from "@/integrations/supabase/client";

export const isDevelopment = import.meta.env.DEV;

export const signInWithTestAccount = async () => {
  if (!isDevelopment) {
    console.warn('Test account login attempted in non-development environment');
    return null;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@kollect-it.com',
      password: 'testpassword123'
    });

    if (error) {
      console.error('Error signing in with test account:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error during test account sign in:', err);
    return null;
  }
};
