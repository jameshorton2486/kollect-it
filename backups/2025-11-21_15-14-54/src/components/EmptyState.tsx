import { Button } from "@/components/ui/button";import { Button } from "@/components/ui/button";
































}  );    </div>      )}        </Button>          <Link href={actionHref}>{actionLabel}</Link>        <Button asChild>      {actionLabel && actionHref && (      </p>        {description}      <p className="text-ink-600 max-w-md mx-auto mb-6">      </h3>        {title}      <h3 className="text-xl font-serif font-semibold text-ink-900 mb-2">      <Icon className="w-16 h-16 mx-auto mb-4 text-ink-500" />    <div className="text-center py-16 px-4">  return (}) {  actionHref?: string;  actionLabel?: string;  description: string;  title: string;  icon: any;}: {  actionHref  actionLabel,  description,  title,  icon: Icon,export function EmptyState({import Link from "next/link";import Link from "next/link";

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
      <Icon className="w-16 h-16 mx-auto mb-4 text-ink-400" />
      <h3 className="text-xl font-serif font-semibold text-ink-900 mb-2">
        {title}
      </h3>
      <p className="text-ink-600 max-w-md mx-auto mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Button asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
