import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

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
  const { data: users, refetch } = useQuery({
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

      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      // Combine profile data with email from auth users
      const enrichedProfiles = profiles!.map(profile => {
        const authUser = authUsers.users.find(user => user.id === profile.id);
        return {
          ...profile,
          email: authUser?.email || 'No email found',
          user_roles: profile.user_roles || []
        } as Profile;
      });

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
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.avatar_url || undefined} />
                <AvatarFallback>
                  {user.first_name?.[0]}
                  {user.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {user.first_name} {user.last_name}
                </div>
                <div className="text-sm text-gray-500">
                  {user.id}
                </div>
              </div>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <select
                value={user.user_roles[0]?.role || "buyer"}
                onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                className="border rounded px-2 py-1"
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
              </select>
            </TableCell>
            <TableCell>{formatDate(user.created_at)}</TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteUser(user.id)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}