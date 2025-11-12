import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { SetupWizard } from './SetupWizard';
import { LoginForm } from './LoginForm';
import { Loader2, Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, setupRequired } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Loading</h3>
            <p className="text-sm text-gray-600">Checking authentication status...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show setup wizard if no admin account exists
  if (setupRequired) {
    return <SetupWizard />;
  }

  // Show login form if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <LoginForm />;
  }

  // User is authenticated or authentication is not required
  return <>{children}</>;
}

// Higher-order component for protecting routes
export function withAuth<T extends object>(
  Component: React.ComponentType<T>,
  requireAuth: boolean = true
) {
  return function AuthenticatedComponent(props: T) {
    return (
      <ProtectedRoute requireAuth={requireAuth}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

// Loading component for authentication checks
export function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Shield className="h-8 w-8 text-blue-600" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-900">Authenticating</h3>
          </div>
          <p className="text-sm text-gray-600">Please wait while we verify your session...</p>
        </div>
      </div>
    </div>
  );
}

// Component for when authentication is required but user is not authenticated
export function UnauthenticatedScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
          <Shield className="h-8 w-8 text-red-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">Authentication Required</h3>
          <p className="text-gray-600">
            You must be logged in to access this page.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
