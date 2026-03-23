import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS, FONTS } from '../../utils/constants';
import { AuthStackParamList, SignUpFormData } from '../../types';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { validateSignUpForm } from '../../utils/validators';
import { getLocalizedError } from '../../utils/errors';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';

type SignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;

// Sign up directly with mobile number and password

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const { t } = useTranslation();
  const { signUp, isLoading } = useAuth();


  // Step 1: form data
  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});


  const handleChange = (field: keyof SignUpFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // Sign Up
  const handleSignUp = async () => {
    const validation = validateSignUpForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await signUp(formData);
      // Navigation handled by AppNavigator via auth state change
    } catch (error: any) {
      const errorMessage = getLocalizedError(error, t);
      Alert.alert(t('auth.signup'), errorMessage);
    }
  };


  // ─── Step 1: Sign Up Details ─────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <Header title={t('dashboard.title')} showBack onBackPress={() => navigation.goBack()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.headerSection}>
              <Text style={styles.emoji}>🌾</Text>
              <Text style={styles.title}>{t('auth.signup')}</Text>
              <Text style={styles.subtitle}>{t('auth.signupSubtitle')}</Text>
            </View>

            <View style={styles.form}>
              <Input
                label={t('auth.fullName')}
                value={formData.fullName}
                onChangeText={(text) => handleChange('fullName', text)}
                placeholder={t('auth.fullName')}
                icon="person"
                error={errors.fullName ? t(errors.fullName) : undefined}
              />

              <Input
                label={t('auth.mobileNumber')}
                value={formData.phoneNumber}
                onChangeText={(text) => handleChange('phoneNumber', text)}
                placeholder="07XXXXXXXX"
                keyboardType="phone-pad"
                icon="phone"
                maxLength={10}
                error={errors.phoneNumber ? t(errors.phoneNumber) : undefined}
              />

              <Input
                label={t('auth.password')}
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                placeholder={t('auth.password')}
                secureTextEntry
                icon="lock"
                error={errors.password ? t(errors.password) : undefined}
              />

              <Input
                label={t('auth.confirmPassword')}
                value={formData.confirmPassword}
                onChangeText={(text) => handleChange('confirmPassword', text)}
                placeholder={t('auth.confirmPassword')}
                secureTextEntry
                icon="lock"
                error={errors.confirmPassword ? t(errors.confirmPassword) : undefined}
              />

              <Button
                title={t('auth.signup')}
                onPress={handleSignUp}
                size="large"
                loading={isLoading}
                disabled={isLoading}
                style={styles.primaryButton}
              />

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>{t('auth.haveAccount')} </Text>
                <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
                  {t('auth.login')}
                </Text>
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
  headerSection: { alignItems: 'center', marginBottom: 32 },
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
  form: { width: '100%' },
  primaryButton: { marginTop: 20, marginBottom: 12 },
  secondaryButton: { marginBottom: 8 },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  loginText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.secondary,
  },
  loginLink: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.medium,
    color: COLORS.primary,
  },
});

export default SignUpScreen;