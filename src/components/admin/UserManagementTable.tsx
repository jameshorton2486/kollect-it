import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody } from "@/components/ui/table";
import { UserTableHeader } from "./UserTableHeader";
import { UserTableRow } from "./UserTableRow";

type UserRole = "admin" | "buyer" | "seller";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  user_roles: { role: UserRole }[];
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export function UserManagementTable() {
  const { data: users, refetch } = useQuery<Profile[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select(`
          id,
          first_name,
          last_name,
          avatar_url,
          created_at,
          updated_at,
          user_roles (
            role
          )
        `);

      if (profilesError) throw profilesError;
      if (!profiles) return [];

      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      // Combine profile data with email from auth users
      const enrichedProfiles = (profiles as any[]).map(profile => {
        if (!profile.id) {
          console.error("Missing ID for profile:", profile);
          return null;
        }

        const authUser = authUsers.users.find(user => user.id === profile.id);
        return {
          ...profile,
          email: authUser?.email || 'No email found',
          user_roles: profile.user_roles || []
        } as Profile;
      }).filter((profile): profile is Profile => profile !== null);

      return enrichedProfiles;
    },
  });

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      // Remove existing roles
      await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      // Add new role
      await supabase
        .from("user_roles")
        .insert([
          { user_id: userId, role: newRole }
        ]);

      refetch();
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Delete user from auth.users
      await supabase.auth.admin.deleteUser(userId);

      // Delete user from profiles (should cascade to user_roles)
      await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      refetch();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (!users) return <div>Loading...</div>;

  return (
    <Table>
      <UserTableHeader />
      <TableBody>
        {users.map((user) => (
          <UserTableRow
            key={user.id}
            user={user}
            onRoleChange={handleRoleChange}
            onDeleteUser={handleDeleteUser}
          />
        ))}
      </TableBody>
    </Table>
  );
}