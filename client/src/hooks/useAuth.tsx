import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  setupRequired: boolean;
  checkSetupStatus: () => Promise<void>;
  createAdminAccount: (data: SetupData) => Promise<SetupResponse>;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  code?: string;
  user?: User;
  locked_until?: string;
  failed_attempts?: number;
}

interface SetupData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SetupResponse {
  success: boolean;
  message?: string;
  code?: string;
  user?: User;
  details?: string[];
}

// API Base URL
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Auth Context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [setupRequired, setSetupRequired] = useState(false);

  // Check if user is authenticated
  const isAuthenticated = !!user && !!token;

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Check for stored token
      const storedToken = localStorage.getItem('auth_token');
      
      if (storedToken) {
        // Verify token with backend
        const response = await fetch(`${API_BASE}/api/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setToken(storedToken);
          setUser(data.user);
        } else {
          // Token is invalid, remove it
          localStorage.removeItem('auth_token');
        }
      }

      // Check setup status
      await checkSetupStatus();
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSetupStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/setup-status`);
      if (response.ok) {
        const data = await response.json();
        setSetupRequired(data.setup_required);
      }
    } catch (error) {
      console.error('Setup status check error:', error);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('auth_token', data.token);
        
        return {
          success: true,
          message: data.message,
          user: data.user
        };
      } else {
        // Login failed
        return {
          success: false,
          message: data.error,
          code: data.code,
          locked_until: data.locked_until,
          failed_attempts: data.failed_attempts
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.',
        code: 'NETWORK_ERROR'
      };
    }
  };

  const createAdminAccount = async (data: SetupData): Promise<SetupResponse> => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();

      if (response.ok) {
        // Setup successful - automatically log in
        setToken(responseData.token);
        setUser(responseData.user);
        localStorage.setItem('auth_token', responseData.token);
        setSetupRequired(false);
        
        return {
          success: true,
          message: responseData.message,
          user: responseData.user
        };
      } else {
        // Setup failed
        return {
          success: false,
          message: responseData.error,
          code: responseData.code,
          details: responseData.details
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.',
        code: 'NETWORK_ERROR'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    
    // Optional: Call logout endpoint
    fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).catch(console.error);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    isLoading,
    setupRequired,
    checkSetupStatus,
    createAdminAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Auth Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Password strength checker
export async function checkPasswordStrength(password: string) {
  try {
    const response = await fetch(`${API_BASE}/api/auth/password-strength`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Password strength check error:', error);
    return null;
  }
}

// Account lockout status checker
export async function checkLockoutStatus(username: string) {
  try {
    const response = await fetch(`${API_BASE}/api/auth/lockout-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Lockout status check error:', error);
    return null;
  }
}
