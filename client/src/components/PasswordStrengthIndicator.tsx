import { useEffect, useState } from 'react';
import { Progress } from './ui/progress';
import { checkPasswordStrength } from '../hooks/useAuth';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

interface PasswordStrength {
  valid: boolean;
  errors: string[];
  strength_score: number;
  strength_label: string;
}

export function PasswordStrengthIndicator({ 
  password, 
  onValidationChange 
}: PasswordStrengthIndicatorProps) {
  const [strength, setStrength] = useState<PasswordStrength | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!password) {
      setStrength(null);
      onValidationChange?.(false, []);
      return;
    }

    const checkStrength = async () => {
      setIsLoading(true);
      try {
        const result = await checkPasswordStrength(password);
        if (result) {
          setStrength(result);
          onValidationChange?.(result.valid, result.errors);
        }
      } catch (error) {
        console.error('Password strength check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(checkStrength, 300);
    return () => clearTimeout(debounceTimer);
  }, [password, onValidationChange]);

  if (!password) return null;

  const getStrengthColor = (score: number) => {
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthTextColor = (score: number) => {
    if (score <= 1) return 'text-red-600';
    if (score <= 2) return 'text-orange-600';
    if (score <= 3) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-3">
      {/* Password Strength Bar */}
      {strength && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Password Strength
            </span>
            <span className={`text-sm font-medium ${getStrengthTextColor(strength.strength_score)}`}>
              {isLoading ? 'Checking...' : strength.strength_label}
            </span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div 
              className={`h-full transition-all duration-300 ${getStrengthColor(strength.strength_score)}`}
              style={{ width: `${(strength.strength_score / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Requirements Checklist */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Password Requirements:</h4>
        <div className="space-y-1">
          {/* Length Check */}
          <RequirementItem
            text="At least 15 characters"
            isValid={password.length >= 15}
            isActive={password.length > 0}
          />
          
          {/* Special Characters Check */}
          <RequirementItem
            text="At least 2 special characters (!@#$%^&*()_+-=[]{}|;:,.<>?)"
            isValid={(password.match(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/g) || []).length >= 2}
            isActive={password.length > 0}
          />
          
          {/* Numbers Check */}
          <RequirementItem
            text="At least 2 numbers"
            isValid={(password.match(/\d/g) || []).length >= 2}
            isActive={password.length > 0}
          />
        </div>
      </div>

      {/* Error Messages */}
      {strength && strength.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex items-start">
            <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
            <div className="space-y-1">
              {strength.errors.map((error, index) => (
                <p key={index} className="text-sm text-red-700">{error}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {strength && strength.valid && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-sm text-green-700">
              Password meets all security requirements!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface RequirementItemProps {
  text: string;
  isValid: boolean;
  isActive: boolean;
}

function RequirementItem({ text, isValid, isActive }: RequirementItemProps) {
  const getIcon = () => {
    if (!isActive) {
      return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
    }
    
    if (isValid) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getTextColor = () => {
    if (!isActive) return 'text-gray-500';
    if (isValid) return 'text-green-700';
    return 'text-red-600';
  };

  return (
    <div className="flex items-center space-x-2">
      {getIcon()}
      <span className={`text-sm ${getTextColor()}`}>
        {text}
      </span>
    </div>
  );
}
