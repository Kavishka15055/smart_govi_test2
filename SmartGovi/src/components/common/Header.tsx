import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../utils/constants';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightIcon?: string;
  onRightPress?: () => void;
  showLanguage?: boolean;
  language?: 'en' | 'si';
  onLanguagePress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBackPress,
  rightIcon,
  onRightPress,
  showLanguage = false,
  language = 'en',
  onLanguagePress,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          {showBack && (
            <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
              <MaterialIcons name="arrow-back" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.title}>{title}</Text>

        <View style={styles.rightContainer}>
          {showLanguage && (
            <TouchableOpacity onPress={onLanguagePress} style={styles.languageButton}>
              <Text style={styles.languageText}>{language === 'en' ? 'EN' : 'සිං'}</Text>
            </TouchableOpacity>
          )}
          
          {!!rightIcon && (
            <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
              <MaterialIcons name={rightIcon as any} size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.white,
  },
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.large,
    color: COLORS.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  iconButton: {
    padding: 4,
  },
  languageButton: {
    padding: 4,
  },
  languageText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.small,
    color: COLORS.primary,
  },
});

export default Header;