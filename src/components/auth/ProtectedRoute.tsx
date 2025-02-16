
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

// Temporarily disable auth protection
export function ProtectedRoute({ children, requireAdmin }: ProtectedRouteProps) {
  return <>{children}</>;
}
