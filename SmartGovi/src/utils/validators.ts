export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Sri Lankan phone number format: 07XXXXXXXX or +947XXXXXXXX
  const phoneRegex = /^(?:\+94|0)[1-9][0-9]{8}$/;
  return phoneRegex.test(phone);
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
  
  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'auth.invalidEmailAddress';
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