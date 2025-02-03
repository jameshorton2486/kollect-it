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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  user_roles: { role: UserRole }[];
  email?: string;
}

type UserRole = 'admin' | 'buyer' | 'seller';

export function UserManagementTable() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      // Fetch profiles with roles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select(`
          *,
          user_roles (role)
        `);

      if (profilesError) throw profilesError;
      if (!profiles) return [];

      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      // Process profiles with proper type casting and validation
      const enrichedProfiles = profiles.map((profile: any): Profile => {
        const matchingAuthUser = authUsers?.users.find(u => u.id === profile.id);
        const userRoles = Array.isArray(profile.user_roles) 
          ? profile.user_roles as { role: UserRole }[]
          : [{ role: 'buyer' as UserRole }];

        return {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
          user_roles: userRoles,
          email: matchingAuthUser?.email
        };
      });

      return enrichedProfiles;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-shop-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        Error loading users. Please try again later.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback>
                    {user.first_name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {user.first_name} {user.last_name}
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {user.user_roles.map(({ role }, index) => (
                    <Badge
                      key={`${user.id}-${role}-${index}`}
                      variant={
                        role === 'admin'
                          ? 'destructive'
                          : role === 'seller'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {role}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(user.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                {format(new Date(user.updated_at), 'MMM d, yyyy')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}