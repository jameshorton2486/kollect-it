
// Temporarily disable auth protection
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
