import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, STORAGE_KEYS } from '../../utils/constants';
import { AuthStackParamList, Language } from '../../types';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';

type LanguageScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Language'>;

const LanguageScreen: React.FC = () => {
  const navigation = useNavigation<LanguageScreenNavigationProp>();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');

  const handleLanguageSelect = async (lang: Language) => {
    setSelectedLanguage(lang);
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    
    // Navigate to Login after selection
    setTimeout(() => {
      navigation.navigate('Login');
    }, 300);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Smart Govi" />
      
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome! ආයුබෝවන්!</Text>
        <Text style={styles.subText}>Choose your language</Text>
        <Text style={styles.subTextSinhala}>ඔබේ කැමති භාෂාව තෝරන්න</Text>

        <View style={styles.languageCards}>
          {/* English Option */}
          <TouchableOpacity
            style={[
              styles.languageCard,
              selectedLanguage === 'en' && styles.selectedCard,
            ]}
            onPress={() => handleLanguageSelect('en')}
            activeOpacity={0.7}
          >
            <Text style={styles.languageTitle}>English</Text>
            <Text style={styles.languageSubtitle}>Continue in English</Text>
            {selectedLanguage === 'en' && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Sinhala Option */}
          <TouchableOpacity
            style={[
              styles.languageCard,
              selectedLanguage === 'si' && styles.selectedCard,
            ]}
            onPress={() => handleLanguageSelect('si')}
            activeOpacity={0.7}
          >
            <Text style={styles.languageTitle}>සිංහල</Text>
            <Text style={styles.languageSubtitle}>සිංහලෙන් ඉදිරියට</Text>
            {selectedLanguage === 'si' && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.comingSoonContainer}>
          <Text style={styles.comingSoonTitle}>COMING SOON</Text>
          <Text style={styles.comingSoonSubtitle}>தமிழ்</Text>
        </View>

        <View style={styles.bottomContainer}>
          <Button
            title="Continue"
            onPress={() => navigation.navigate('Login')}
            size="large"
            disabled={!selectedLanguage}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  welcomeText: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xlarge,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  subTextSinhala: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  languageCards: {
    marginBottom: 30,
  },
  languageCard: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.lightGray,
  },
  languageTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.large,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  languageSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.secondary,
  },
  checkmark: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  comingSoonContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
  },
  comingSoonTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.medium,
    color: COLORS.accent,
    marginBottom: 4,
  },
  comingSoonSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.large,
    color: COLORS.text.secondary,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
});

export default LanguageScreen;