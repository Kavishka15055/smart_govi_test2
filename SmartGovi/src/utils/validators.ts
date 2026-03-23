export const validatePhoneNumber = (phone: string): boolean => {
  // Sri Lankan mobile numbers: 07XXXXXXXX (10 digits starting with 07)
  const phoneRegex = /^07[0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

export const validateOtp = (code: string): boolean => {
  return /^[0-9]{6}$/.test(code.trim());
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push('auth.passwordMinLength');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('auth.passwordNoUppercase');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('auth.passwordNoNumber');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateSignUpForm = (data: any): {
  isValid: boolean;
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'auth.fullNameMinLength';
  }

  if (!data.phoneNumber || !validatePhoneNumber(data.phoneNumber)) {
    errors.phoneNumber = 'auth.invalidPhoneFormat';
  }

  if (!data.password) {
    errors.password = 'auth.passwordRequired';
  } else {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0];
    }
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'auth.passwordsDoNotMatch';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLoginForm = (data: any): {
  isValid: boolean;
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};

  if (!data.phoneNumber || !validatePhoneNumber(data.phoneNumber)) {
    errors.phoneNumber = 'auth.invalidPhoneFormat';
  }

  if (!data.password) {
    errors.password = 'auth.passwordRequired';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};