import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'board' | 'member';
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  verify2FA: (code: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  requires2FA: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requires2FA, setRequires2FA] = useState(false);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // TODO: Call your QNAP API: GET /api/auth/verify
          // const response = await fetch('YOUR_QNAP_API/api/auth/verify', {
          //   headers: { 'Authorization': `Bearer ${token}` }
          // });
          // const userData = await response.json();
          // setUser(userData);
        }
      } catch (error) {
        console.error('Session check failed:', error);
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // TODO: Call your QNAP API: POST /api/auth/login
      // const response = await fetch('YOUR_QNAP_API/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();
      
      // Mock response - remove this when implementing real API
      setRequires2FA(true);
      
      // If 2FA is required, return early
      // if (data.requires2FA) {
      //   setRequires2FA(true);
      //   return;
      // }
      
      // Otherwise set user and token
      // localStorage.setItem('auth_token', data.token);
      // setUser(data.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const verify2FA = async (code: string) => {
    try {
      // TODO: Call your QNAP API: POST /api/auth/verify-2fa
      // const response = await fetch('YOUR_QNAP_API/api/auth/verify-2fa', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ code })
      // });
      // const data = await response.json();
      
      // Mock response - replace with real API
      const mockUser: User = {
        id: '1',
        email: 'user@example.com',
        name: 'John Doe',
        role: 'member',
        phone: '+1234567890'
      };
      
      localStorage.setItem('auth_token', 'mock-token');
      setUser(mockUser);
      setRequires2FA(false);
    } catch (error) {
      console.error('2FA verification failed:', error);
      throw error;
    }
  };

  const logout = () => {
    // TODO: Call your QNAP API: POST /api/auth/logout
    localStorage.removeItem('auth_token');
    setUser(null);
    setRequires2FA(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        verify2FA,
        logout,
        isAuthenticated: !!user,
        isLoading,
        requires2FA
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
