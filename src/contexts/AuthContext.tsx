
import { createContext, useContext } from 'react';

interface AuthContextType {
  user: any;
  session: any;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: { id: 'test-user', email: 'test@example.com' },
  session: { user: { id: 'test-user', email: 'test@example.com' } },
  isLoading: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={{
      user: { id: 'test-user', email: 'test@example.com' },
      session: { user: { id: 'test-user', email: 'test@example.com' } },
      isLoading: false,
      signOut: async () => {},
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
