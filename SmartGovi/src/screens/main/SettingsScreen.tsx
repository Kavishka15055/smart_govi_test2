import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Switch,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { COLORS, FONTS } from '../../utils/constants';
import { useSettings } from '../../context/SettingsContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SupportedLanguage } from '../../i18n';

const SettingsScreen: React.FC = () => {
  const { settings, toggleMonthlyComparison, changeLanguage } = useSettings();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const languages: { code: SupportedLanguage; label: string; nativeLabel: string }[] = [
    { code: 'en', label: 'English', nativeLabel: 'English' },
    { code: 'si', label: 'Sinhala', nativeLabel: 'සිංහල' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          <Text style={styles.sectionSubtitle}>{t('settings.selectLanguage')}</Text>

          <View style={styles.languageContainer}>
            {languages.map((lang) => {
              const isSelected = settings.language === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageButton,
                    isSelected && styles.languageButtonSelected,
                  ]}
                  onPress={() => changeLanguage(lang.code)}
                >
                  <Text style={styles.languageFlagEmoji}>
                    {lang.code === 'en' ? '🇬🇧' : '🇱🇰'}
                  </Text>
                  <View style={styles.languageLabelContainer}>
                    <Text
                      style={[
                        styles.languageButtonText,
                        isSelected && styles.languageButtonTextSelected,
                      ]}
                    >
                      {lang.nativeLabel}
                    </Text>
                    {lang.code === 'si' && (
                      <Text style={styles.languageButtonSubText}>Sinhala</Text>
                    )}
                  </View>
                  {isSelected && (
                    <MaterialIcons name="check-circle" size={22} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Report Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.reportSettings')}</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{t('settings.showMonthlyComparison')}</Text>
              <Text style={styles.settingDescription}>
                {t('settings.showMonthlyComparisonDesc')}
              </Text>
            </View>
            <Switch
              value={settings.showMonthlyComparison}
              onValueChange={toggleMonthlyComparison}
              trackColor={{ false: COLORS.border, true: COLORS.secondary }}
              thumbColor={settings.showMonthlyComparison ? COLORS.primary : COLORS.white}
            />
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>{t('settings.version')}</Text>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.large,
    color: COLORS.text.primary,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: COLORS.white,
    marginTop: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    letterSpacing: 0.8,
  },
  sectionSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.secondary,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  languageContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 10,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  languageButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F7F0',
  },
  languageFlagEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  languageLabelContainer: {
    flex: 1,
  },
  languageButtonText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.primary,
  },
  languageButtonTextSelected: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
  languageButtonSubText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.primary,
  },
  settingDescription: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  versionText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.secondary,
  },
});

export default SettingsScreen;
