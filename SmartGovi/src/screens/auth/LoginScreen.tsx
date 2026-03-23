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
import { validateLoginForm } from '../../utils/validators';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { t } = useTranslation();
  const { login, isLoading, error, clearError } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = async () => {
    const validation = validateLoginForm({ phoneNumber, password });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});

    try {
      await login(phoneNumber, password, rememberMe);
    } catch (err) {
      // Error handled in context
    }
  };

  const handleChange = (field: string, value: string) => {
    if (field === 'phoneNumber') setPhoneNumber(value);
    if (field === 'password') setPassword(value);
    if (errors[field]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
    clearError();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title={t('dashboard.title')} showBack onBackPress={() => navigation.goBack()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.headerSection}>
              <Text style={styles.emoji}>📱</Text>
              <Text style={styles.title}>{t('auth.login')}</Text>
              <Text style={styles.subtitle}>{t('auth.loginSubtitle')}</Text>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.form}>
              <Input
                label={t('auth.mobileNumber')}
                value={phoneNumber}
                onChangeText={(text) => handleChange('phoneNumber', text)}
                placeholder="07XXXXXXXX"
                keyboardType="phone-pad"
                icon="phone"
                error={errors.phoneNumber ? t(errors.phoneNumber) : undefined}
                maxLength={10}
              />

              <Input
                label={t('auth.password')}
                value={password}
                onChangeText={(text) => handleChange('password', text)}
                placeholder={t('auth.password')}
                secureTextEntry
                icon="lock"
                error={errors.password ? t(errors.password) : undefined}
              />

              {/* Remember Me */}
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
  container: { flex: 1, backgroundColor: COLORS.white },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 },
  headerSection: { alignItems: 'center', marginBottom: 36 },
  emoji: { fontSize: 52, marginBottom: 12 },
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
  form: { width: '100%' },
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
  checkboxChecked: { backgroundColor: COLORS.primary },
  checkmark: { color: COLORS.white, fontSize: 14, fontWeight: 'bold' },
  rememberMeText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.secondary,
  },
  signupContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
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