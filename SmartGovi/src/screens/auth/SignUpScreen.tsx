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
import { useAuth } from '../../context/AuthContext';
import { validateSignUpForm, validatePhoneNumber } from '../../utils/validators';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';

type SignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const { signUp, isLoading } = useAuth();

  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof SignUpFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSignUp = async () => {
    // Validate form
    const validation = validateSignUpForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await signUp(formData);
      // Navigate to Farm Setup after successful signup
      navigation.navigate('FarmSetup');
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Smart Govi" showBack onBackPress={() => navigation.goBack()} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Create New Account</Text>
            <Text style={styles.subtitle}>නව ගිණුමක් සාදන්න</Text>

            <View style={styles.form}>
              <Input
                label="Full Name / සම්පූර්ණ නම"
                value={formData.fullName}
                onChangeText={(text) => handleChange('fullName', text)}
                placeholder="Enter your full name"
                icon="person"
                error={errors.fullName}
              />

              <Input
                label="Phone Number / දුරකථන අංකය"
                value={formData.phoneNumber}
                onChangeText={(text) => handleChange('phoneNumber', text)}
                placeholder="07XXXXXXXX"
                keyboardType="phone-pad"
                icon="phone"
                error={errors.phoneNumber}
              />

              <Input
                label="Email / ඊමේල් ලිපිනය"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                icon="email"
                error={errors.email}
              />

              <Input
                label="Password / මුරපදය"
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                placeholder="Create a password"
                secureTextEntry
                icon="lock"
                error={errors.password}
              />

              <Input
                label="Confirm Password / මුරපදය තහවුරු කරන්න"
                value={formData.confirmPassword}
                onChangeText={(text) => handleChange('confirmPassword', text)}
                placeholder="Confirm your password"
                secureTextEntry
                icon="lock"
                error={errors.confirmPassword}
              />

              <Button
                title="Sign Up / ලියාපදිංචි වන්න"
                onPress={handleSignUp}
                size="large"
                loading={isLoading}
                disabled={isLoading}
                style={styles.signUpButton}
              />

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? / </Text>
                <Text
                  style={styles.loginLink}
                  onPress={() => navigation.navigate('Login')}
                >
                  Login
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
    paddingTop: 20,
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
    marginBottom: 30,
  },
  form: {
    width: '100%',
  },
  signUpButton: {
    marginTop: 20,
    marginBottom: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
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