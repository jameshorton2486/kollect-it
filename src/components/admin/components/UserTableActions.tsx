
import { Button } from "@/components/ui/button";

interface UserTableActionsProps {
  selectedUsers: string[];
}

export function UserTableActions({ selectedUsers }: UserTableActionsProps) {
  return (
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
  );
}
