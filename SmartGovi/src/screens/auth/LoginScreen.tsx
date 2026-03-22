import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONTS } from '../../utils/constants';
import { AuthStackParamList } from '../../types';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Header from '../../components/common/Header';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { t } = useTranslation();
  const { login, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = (): boolean => {
    let isValid = true;
    
    if (!email) {
      setEmailError(t('auth.emailRequired'));
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(t('auth.invalidEmailFormat'));
      isValid = false;
    } else {
      setEmailError('');
    }
    
    if (!password) {
      setPasswordError(t('auth.passwordRequired'));
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    try {
      await login(email, password, rememberMe);
      // Navigation will happen automatically based on auth state
    } catch (err) {
      // Error is handled in context
    }
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password screen
    console.log('Forgot password');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title={t('dashboard.title')} showBack onBackPress={() => navigation.goBack()} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>{t('auth.login')}</Text>
            <Text style={styles.subtitle}>{t('splash.tagline')}</Text>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.form}>
              <Input
                label={t('auth.email')}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError('');
                  clearError();
                }}
                placeholder={t('auth.email')}
                keyboardType="email-address"
                autoCapitalize="none"
                icon="email"
                error={emailError}
              />

              <Input
                label={t('auth.password')}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError('');
                  clearError();
                }}
                placeholder={t('auth.password')}
                secureTextEntry
                icon="lock"
                error={passwordError}
              />

              <TouchableOpacity
                style={styles.rememberMeContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.rememberMeText}>{t('auth.rememberMe')}</Text>
              </TouchableOpacity>

              <Button
                title={t('auth.login')}
                onPress={handleLogin}
                size="large"
                loading={isLoading}
                disabled={isLoading}
              />

              <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotButton}>
                <Text style={styles.forgotText}>
                  {t('auth.forgotPassword')}
                </Text>
              </TouchableOpacity>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>{t('auth.noAccount')} </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                  <Text style={styles.signupLink}>{t('auth.signup')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xxlarge,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  errorContainer: {
    backgroundColor: COLORS.error + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.error,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 4,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  rememberMeText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.secondary,
  },
  forgotButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  forgotText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.primary,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  signupText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.secondary,
  },
  signupLink: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.medium,
    color: COLORS.primary,
  },
});

export default LoginScreen;