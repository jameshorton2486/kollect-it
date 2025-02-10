
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserTableRow } from "./UserTableRow";
import { Table, TableHeader, TableBody } from "@/components/ui/table";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";

type UserRole = 'admin' | 'buyer' | 'seller';

interface UserRoleData {
  role: UserRole;
}

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  business_name: string | null;
  is_seller: boolean | null;
  seller_since: string | null;
  total_sales: number | null;
  rating: number | null;
  user_roles: UserRoleData[];
}

interface SupabaseProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  business_name: string | null;
  is_seller: boolean | null;
  seller_since: string | null;
  total_sales: number | null;
  rating: number | null;
  user_roles: { role: UserRole }[] | null;
}

export function UserManagementTable() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const { data: users, isLoading, error } = useQuery<Profile[]>({
    queryKey: ['users'],
    queryFn: async () => {
      // First get profiles with user roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles:user_roles(role)
        `) as { data: SupabaseProfile[] | null, error: any };

      if (profilesError) throw profilesError;
      if (!profiles) throw new Error('No profiles found');

      // Then get emails from auth.users
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      // Combine the data and ensure user_roles is properly formatted
      return profiles.map(profile => {
        const authUser = authUsers.find(u => u.id === profile.id);
        return {
          ...profile,
          email: authUser?.email || '',
          // Ensure user_roles is properly typed even if it's null
          user_roles: Array.isArray(profile.user_roles) 
            ? profile.user_roles.map(r => ({ role: r.role }))
            : []
        } as Profile;
      });
    }
  });

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;
      toast.success("User role updated successfully");
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading users: {(error as Error).message}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">User Management</h2>
          <div className="space-x-2">
            <Button
              variant="destructive"
              disabled={selectedUsers.length === 0}
              onClick={() => {/* Implement bulk delete */}}
            >
              Delete Selected
            </Button>
            <Button
              variant="outline"
              disabled={selectedUsers.length === 0}
              onClick={() => {/* Implement bulk role update */}}
            >
              Update Roles
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <tr>
              <th className="w-12">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (users) {
                      setSelectedUsers(
                        e.target.checked ? users.map(user => user.id) : []
                      );
                    }
                  }}
                />
              </th>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td colSpan={5}>
                    <div className="flex items-center space-x-4 p-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              users?.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  selected={selectedUsers.includes(user.id)}
                  onSelect={() => handleUserSelection(user.id)}
                  onRoleChange={handleRoleChange}
                  onDeleteUser={async (userId) => {
                    try {
                      const { error } = await supabase
                        .from('profiles')
                        .delete()
                        .eq('id', userId);
                      
                      if (error) throw error;
                      toast.success("User deleted successfully");
                    } catch (error) {
                      console.error('Error deleting user:', error);
                      toast.error('Failed to delete user');
                    }
                  }}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </ErrorBoundary>
  );
}
