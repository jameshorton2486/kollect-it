
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { User } from "lucide-react";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

export function ProfileSettings() {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data as Profile;
    }
  });

  const updateProfile = useMutation({
    mutationFn: async (values: Partial<Profile>) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const { error } = await supabase
        .from('profiles')
        .update(values)
        .eq('id', session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast.error('Failed to update profile');
    }
  });

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                defaultValue={profile?.first_name || ''}
                onChange={(e) => {
                  updateProfile.mutate({ first_name: e.target.value });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                defaultValue={profile?.last_name || ''}
                onChange={(e) => {
                  updateProfile.mutate({ last_name: e.target.value });
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
