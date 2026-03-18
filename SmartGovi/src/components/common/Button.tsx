import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { COLORS, FONTS } from '../../utils/constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return COLORS.disabled;
    switch (variant) {
      case 'primary':
        return COLORS.primary;
      case 'secondary':
        return COLORS.secondary;
      case 'outline':
      case 'text':
        return 'transparent';
      default:
        return COLORS.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return COLORS.text.disabled;
    switch (variant) {
      case 'primary':
      case 'secondary':
        return COLORS.white;
      case 'outline':
      case 'text':
        return COLORS.primary;
      default:
        return COLORS.white;
    }
  };

  const getBorderColor = () => {
    if (disabled) return COLORS.disabled;
    switch (variant) {
      case 'outline':
        return COLORS.primary;
      default:
        return 'transparent';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case 'medium':
        return { paddingVertical: 12, paddingHorizontal: 24 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 32 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 24 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return FONTS.sizes.small;
      case 'medium':
        return FONTS.sizes.medium;
      case 'large':
        return FONTS.sizes.large;
      default:
        return FONTS.sizes.medium;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        { borderColor: getBorderColor() },
        getPadding(),
        variant === 'outline' && styles.outline,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {icon && icon}
          <Text
            style={[
              styles.text,
              { color: getTextColor() },
              { fontSize: getFontSize() },
              icon ? styles.textWithIcon : null,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  text: {
    fontFamily: FONTS.medium,
    textAlign: 'center',
  },
  textWithIcon: {
    marginLeft: 8,
  },
  outline: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
});

export default Button;