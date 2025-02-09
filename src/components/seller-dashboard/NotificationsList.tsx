
import { Bell, Package, AlertTriangle, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NotificationsListProps {
  notifications: any[];
  onMarkAsRead: (id: string) => void;
}

export function NotificationsList({ notifications, onMarkAsRead }: NotificationsListProps) {
  return (
    <ScrollArea className="h-[300px]">
      {notifications?.length ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start space-x-4 rounded-lg border p-3 ${
                notification.read ? 'bg-muted/50' : 'bg-white'
              }`}
            >
              {notification.type === 'new_order' ? (
                <Package className="h-5 w-5 text-blue-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Badge variant={notification.read ? "secondary" : "default"}>
                  {notification.type === 'new_order' ? 'Order' : 'Alert'}
                </Badge>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground py-8">
          No new notifications
        </p>
      )}
    </ScrollArea>
  );
}
