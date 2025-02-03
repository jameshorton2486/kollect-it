import { useState } from "react";
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
import { Shield, UserX, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function UserManagementTable() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const { data: users, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select(`
          *,
          user_roles (
            role
          )
        `);

      if (error) throw error;
      return profiles;
    },
  });

  const handleRoleUpdate = async (userId: string, role: string) => {
    try {
      setLoading(userId);
      const { error } = await supabase
        .from("user_roles")
        .upsert({ user_id: userId, role })
        .eq("user_id", userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.user_roles?.[0]?.role || "buyer"}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRoleUpdate(user.id, "admin")}
                    disabled={loading === user.id}
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    Make Admin
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRoleUpdate(user.id, "seller")}
                    disabled={loading === user.id}
                  >
                    <UserCheck className="h-4 w-4 mr-1" />
                    Make Seller
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRoleUpdate(user.id, "buyer")}
                    disabled={loading === user.id}
                  >
                    <UserX className="h-4 w-4 mr-1" />
                    Remove Role
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}