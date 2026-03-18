import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { authService } from '../services/authService';
import { User, AuthState } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  signUp: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) {
        setState({
          user: JSON.parse(savedUser),
          isLoading: false,
          error: null,
        });
      } else {
        setState({
          user: null,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        error: 'Failed to restore session',
      });
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const user = await authService.login(email, password);
      
      if (rememberMe) {
        await AsyncStorage.setItem('user', JSON.stringify(user));
      }
      
      setState({
        user,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState({
        user: null,
        isLoading: false,
        error: error.message || 'Login failed',
      });
      throw error;
    }
  };

  const signUp = async (userData: any) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const user = await authService.signUp(userData);
      
      setState({
        user,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState({
        user: null,
        isLoading: false,
        error: error.message || 'Sign up failed',
      });
      throw error;
    }
  };

  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await authService.logout();
      await AsyncStorage.removeItem('user');
      setState({
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Logout failed',
      }));
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signUp,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};