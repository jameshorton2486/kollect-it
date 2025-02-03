import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

type UserRole = "admin" | "buyer" | "seller";

interface UserTableRowProps {
  user: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    avatar_url: string | null;
    created_at: string;
    user_roles: { role: UserRole }[];
  };
  selected?: boolean;
  onSelect?: () => void;
  onRoleChange: (userId: string, newRole: UserRole) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
}

export function UserTableRow({ user, selected, onSelect, onRoleChange, onDeleteUser }: UserTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        {onSelect && (
          <input
            type="checkbox"
            checked={selected}
            onChange={onSelect}
            className="mr-2"
          />
        )}
        <div className="flex items-center gap-3">
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
        </div>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <select
          value={user.user_roles[0]?.role || "buyer"}
          onChange={(e) => onRoleChange(user.id, e.target.value as UserRole)}
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
          onClick={() => onDeleteUser(user.id)}
        >
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
}