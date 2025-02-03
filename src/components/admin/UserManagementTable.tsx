import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserTableRow } from "./UserTableRow";
import { Table, TableHeader, TableBody } from "@/components/ui/table";

type UserRole = 'admin' | 'buyer' | 'seller';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email?: string; // Added to match the required type
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  user_roles: { role: UserRole }[];
}

export function UserManagementTable() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // First get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Then get user roles for each profile
      const profilesWithRoles = await Promise.all(
        profiles.map(async (profile) => {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.id);

          return {
            ...profile,
            user_roles: roles || []
          } as Profile;
        })
      );

      return profilesWithRoles;
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

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error loading users: {error.message}</div>;
  }

  return (
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
          {users?.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              selected={selectedUsers.includes(user.id)}
              onSelect={() => handleUserSelection(user.id)}
              onRoleChange={handleRoleChange}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}