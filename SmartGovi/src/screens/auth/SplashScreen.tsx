import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS, FONTS } from '../../utils/constants';
import { AuthStackParamList } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

type SplashScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Splash'>;

const { width, height } = Dimensions.get('window');

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();
  
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);
  const progressAnim = new Animated.Value(0);

  useEffect(() => {
    // Animate logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // Navigate after animation
    setTimeout(() => {
      if (user) {
        navigation.replace('Main' as any);
      } else {
        navigation.replace('Language');
      }
    }, 2500);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoEmoji}>🌾</Text>
        </View>
        <Text style={styles.appName}>Smart Govi</Text>
        <Text style={styles.appNameSinhala}>ගොවිගණනය</Text>
      </Animated.View>

      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            { width: progressWidth },
          ]}
        />
      </View>

      <Text style={styles.tagline}>
        {t('splash.tagline')}
      </Text>
      <Text style={styles.taglineSinhala}>
        ඔබේ ගොවිපල මූල්ය සහායකයා
      </Text>

      <Text style={styles.version}>v1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoEmoji: {
    fontSize: 60,
  },
  appName: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xxxlarge,
    color: COLORS.primary,
    marginBottom: 4,
  },
  appNameSinhala: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.large,
    color: COLORS.text.secondary,
  },
  progressContainer: {
    width: width * 0.6,
    height: 4,
    backgroundColor: COLORS.lightGray,
    borderRadius: 2,
    marginBottom: 30,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  tagline: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  taglineSinhala: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.disabled,
  },
  version: {
    position: 'absolute',
    bottom: 20,
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.disabled,
  },
});

export default SplashScreen;