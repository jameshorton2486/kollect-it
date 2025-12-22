import Link from "next/link";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  /** Error title */
  title: string;
  /** Error description */
  description?: string;
  /** Function to retry the failed action */
  retryAction?: () => void;
  /** Link to go back */
  backHref?: string;
  /** Back button label */
  backLabel?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ErrorState - A reusable component for displaying error states
 * 
 * Used when: API errors, network failures, validation errors, etc.
 * 
 * @example
 * <ErrorState
 *   title="Something went wrong"
 *   description="We couldn't load the products. Please try again."
 *   retryAction={() => refetch()}
 *   backHref="/browse"
 * />
 */
export function ErrorState({
  title,
  description,
  retryAction,
  backHref,
  backLabel = "Go Back",
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-16 md:py-20 px-4 gap-6 ${className}`}
      role="alert"
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
        <AlertCircle className="w-7 h-7 text-red-600" aria-hidden="true" />
      </div>

      {/* Title */}
      <h2 className="heading-section text-lux-black">{title}</h2>

      {/* Description */}
      {description && (
        <p className="lead max-w-md text-ink-600">{description}</p>
      )}

      {/* Actions */}
      {(retryAction || backHref) && (
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2 w-full sm:w-auto">
          {retryAction && (
            <button
              onClick={retryAction}
              className="btn-primary rounded-full w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Try Again
            </button>
          )}
          {backHref && (
            <Link
              href={backHref}
              className="btn-secondary rounded-full w-full sm:w-auto text-center"
            >
              {backLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default ErrorState;
