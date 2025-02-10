
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Profile, SupabaseProfile, AuthUser } from "../types/userManagement";

export function useUserData() {
  return useQuery<Profile[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles:user_roles(role)
        `) as { data: SupabaseProfile[] | null, error: any };

      if (profilesError) throw profilesError;
      if (!profiles) throw new Error('No profiles found');

      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      return profiles.map(profile => {
        const authUser = (authUsers as AuthUser[]).find(u => u.id === profile.id);
        return {
          ...profile,
          email: authUser?.email || '',
          user_roles: profile.user_roles?.map(r => ({ role: r.role })) || []
        } satisfies Profile;
      });
    }
  });
}
