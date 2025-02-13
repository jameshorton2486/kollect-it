
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody } from "@/components/ui/table";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import { UserTableRow } from "./UserTableRow";
import { UserTableActions } from "./components/UserTableActions";
import { useUserData } from "./hooks/useUserData";
import type { UserRole } from "./types/userManagement";

export function UserManagementTable() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { data: users, isLoading, error, refetch } = useUserData();

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;
      toast.success("User role updated successfully");
      refetch();
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

  const handleDeleteUser = async (userId: string) => {
    try {
      // First delete from user_roles
      const { error: rolesError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);
      
      if (rolesError) throw rolesError;

      // Then delete from profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (profileError) throw profileError;

      // Finally delete the auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) throw authError;

      toast.success("User deleted successfully");
      refetch();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
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
          <UserTableActions selectedUsers={selectedUsers} />
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
                  onDeleteUser={handleDeleteUser}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </ErrorBoundary>
  );
}
