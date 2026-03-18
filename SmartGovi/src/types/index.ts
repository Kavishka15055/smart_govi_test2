// User related types
export interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  farmName?: string;
  location?: string;
  preferredLanguage: 'en' | 'si';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Navigation params
export type AuthStackParamList = {
  Splash: undefined;
  Language: undefined;
  Login: undefined;
  SignUp: undefined;
  FarmSetup: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  FarmSetup: undefined;
};

// Form data types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignUpFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Language type
export type Language = 'en' | 'si';