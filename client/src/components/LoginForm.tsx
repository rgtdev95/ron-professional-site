import { useState, useEffect } from 'react';
import { useAuth, checkLockoutStatus } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, AlertCircle, Loader2, LogIn, Clock, Shield } from 'lucide-react';

interface LoginFormData {
  username: string;
  password: string;
}

export function LoginForm() {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutInfo, setLockoutInfo] = useState<{
    locked_until?: string;
    failed_attempts?: number;
    timeRemaining?: string;
  }>({});
  const [lockoutTimer, setLockoutTimer] = useState<NodeJS.Timeout | null>(null);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (lockoutTimer) {
        clearTimeout(lockoutTimer);
      }
    };
  }, [lockoutTimer]);

  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const checkUserLockoutStatus = async (username: string) => {
    if (!username.trim()) return;
    
    try {
      const status = await checkLockoutStatus(username);
      if (status) {
        setIsLocked(status.locked);
        setLockoutInfo({
          locked_until: status.locked_until,
          failed_attempts: status.failed_attempts
        });
        
        if (status.locked && status.locked_until) {
          startLockoutTimer(status.locked_until);
        }
      }
    } catch (error) {
      console.error('Failed to check lockout status:', error);
    }
  };

  const startLockoutTimer = (lockedUntil: string) => {
    const updateTimeRemaining = () => {
      const now = new Date();
      const lockoutEnd = new Date(lockedUntil);
      const timeDiff = lockoutEnd.getTime() - now.getTime();
      
      if (timeDiff <= 0) {
        setIsLocked(false);
        setLockoutInfo({});
        setError(null);
        if (lockoutTimer) {
          clearTimeout(lockoutTimer);
          setLockoutTimer(null);
        }
        return;
      }
      
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      
      setLockoutInfo(prev => ({
        ...prev,
        timeRemaining: `${hours}h ${minutes}m ${seconds}s`
      }));
      
      // Update every second
      const timer = setTimeout(updateTimeRemaining, 1000);
      setLockoutTimer(timer);
    };
    
    updateTimeRemaining();
  };

  const handleUsernameBlur = () => {
    if (formData.username.trim()) {
      checkUserLockoutStatus(formData.username);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.password) {
      setError('Please enter both username and password');
      return;
    }

    if (isLocked) {
      setError('Account is locked. Please wait for the lockout period to expire.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await login(formData);
      
      if (!result.success) {
        setError(result.message || 'Login failed');
        
        // Handle account lockout
        if (result.code === 'ACCOUNT_LOCKED') {
          setIsLocked(true);
          setLockoutInfo({
            locked_until: result.locked_until,
            failed_attempts: result.failed_attempts
          });
          
          if (result.locked_until) {
            startLockoutTimer(result.locked_until);
          }
        } else if (result.code === 'INVALID_CREDENTIALS') {
          // Check if this caused a lockout
          await checkUserLockoutStatus(formData.username);
        }
      }
      // If successful, the useAuth hook will handle the redirect
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your admin account
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Admin Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Lockout Warning */}
              {isLocked && (
                <Alert variant="destructive">
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">Account Locked</p>
                      <p>
                        This account has been locked due to {lockoutInfo.failed_attempts} failed login attempts.
                      </p>
                      {lockoutInfo.timeRemaining && (
                        <p>
                          Time remaining: <span className="font-mono">{lockoutInfo.timeRemaining}</span>
                        </p>
                      )}
                      <p className="text-sm">
                        The account will automatically unlock after 12 hours, or you can use the manual unlock script on the server.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Error Messages */}
              {error && !isLocked && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Failed Attempts Warning */}
              {lockoutInfo.failed_attempts > 0 && !isLocked && (
                <Alert variant="default" className="border-amber-500/20 bg-amber-500/10">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <AlertDescription className="text-amber-200">
                    <strong>Warning:</strong> {lockoutInfo.failed_attempts} failed login attempt{lockoutInfo.failed_attempts > 1 ? 's' : ''}. 
                    Account will be locked after 3 failed attempts.
                  </AlertDescription>
                </Alert>
              )}

              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange('username')}
                  onBlur={handleUsernameBlur}
                  placeholder="Enter your username"
                  required
                  disabled={isSubmitting || isLocked}
                  className="w-full"
                  autoComplete="username"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  placeholder="Enter your password"
                  required
                  disabled={isSubmitting || isLocked}
                  className="w-full"
                  autoComplete="current-password"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || isLocked || !formData.username || !formData.password}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : isLocked ? (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Account Locked
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>

              {/* Security Notice */}
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  For security, accounts are locked for 12 hours after 3 failed login attempts. 
                  Make sure you're using the correct credentials.
                </AlertDescription>
              </Alert>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            If you've forgotten your credentials or need to unlock your account, 
            please use the server management tools.
          </p>
        </div>
      </div>
    </div>
  );
}
