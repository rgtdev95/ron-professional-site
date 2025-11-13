import { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

export function PasswordStrengthIndicator({ 
  password, 
  onValidationChange 
}: PasswordStrengthIndicatorProps) {
  
  // Simple client-side validation - no API calls!
  const hasMinLength = password.length >= 15;
  const hasNumbers = (password.match(/\d/g) || []).length >= 2;
  const hasSpecialChars = (password.match(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/g) || []).length >= 2;
  
  const isValid = hasMinLength && hasNumbers && hasSpecialChars;
  const errors: string[] = [];
  
  if (!hasMinLength) errors.push('Password must be at least 15 characters');
  if (!hasNumbers) errors.push('Password must contain at least 2 numbers');
  if (!hasSpecialChars) errors.push('Password must contain at least 2 special characters');

  useEffect(() => {
    if (password) {
      onValidationChange?.(isValid, errors);
    } else {
      onValidationChange?.(false, []);
    }
  }, [password, isValid, errors.length]);

  if (!password) return null;

  return (
    <div className="space-y-3">
      {/* Requirements Checklist */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Password Requirements:</h4>
        <div className="space-y-1">
          {/* Length Check */}
          <RequirementItem
            text="At least 15 characters"
            isValid={hasMinLength}
          />
          
          {/* Special Characters Check */}
          <RequirementItem
            text="At least 2 special characters (!@#$%^&*()_+-=[]{}|;:,.<>?)"
            isValid={hasSpecialChars}
          />
          
          {/* Numbers Check */}
          <RequirementItem
            text="At least 2 numbers"
            isValid={hasNumbers}
          />
        </div>
      </div>

      {/* Success Message */}
      {isValid && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-sm text-green-700">
              Password meets all requirements!
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
}

function RequirementItem({ text, isValid }: RequirementItemProps) {
  return (
    <div className="flex items-center space-x-2">
      {isValid ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500" />
      )}
      <span className={`text-sm ${isValid ? 'text-green-700' : 'text-red-600'}`}>
        {text}
      </span>
    </div>
  );
}
