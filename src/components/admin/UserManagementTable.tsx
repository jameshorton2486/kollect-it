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

type UserRole = "buyer" | "seller" | "admin";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  user_roles: { role: UserRole }[];
}

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
      return profiles as Profile[];
    },
  });

  const handleRoleUpdate = async (userId: string, role: UserRole) => {
    try {
      setLoading(userId);
      
      // First, delete any existing roles for this user
      await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      // Then insert the new role
      const { error } = await supabase
        .from("user_roles")
        .insert({
          user_id: userId,
          role: role,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      refetch();
    } catch (error) {
      console.error('Update error:', error);
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
            <TableHead className="text-right">Actions</TableHead>
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
                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleRoleUpdate(user.id, "admin")}
                    disabled={loading === user.id}
                    className="bg-shop-accent1 text-white hover:bg-shop-accent1/90 text-lg px-6 py-3"
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    Make Admin
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleRoleUpdate(user.id, "seller")}
                    disabled={loading === user.id}
                    className="bg-shop-accent1 text-white hover:bg-shop-accent1/90 text-lg px-6 py-3"
                  >
                    <UserCheck className="h-5 w-5 mr-2" />
                    Make Seller
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleRoleUpdate(user.id, "buyer")}
                    disabled={loading === user.id}
                    className="bg-shop-accent1 text-white hover:bg-shop-accent1/90 text-lg px-6 py-3"
                  >
                    <UserX className="h-5 w-5 mr-2" />
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