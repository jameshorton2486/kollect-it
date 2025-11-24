import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <Icon className="w-16 h-16 mx-auto mb-4 text-lux-gray" />
      <h3 className="text-xl font-serif font-semibold text-lux-black mb-2">
        {title}
      </h3>
      <p className="text-lux-gray-dark max-w-md mx-auto mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Button asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
