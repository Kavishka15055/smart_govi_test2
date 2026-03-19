import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONTS } from '../../utils/constants';
import { MaterialIcons } from '@expo/vector-icons';

const formatPhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber) return '';
  // Ensure it starts with +94 if not already
  let cleaned = phoneNumber.replace(/\D/g, '');
  if (cleaned.startsWith('94')) {
    cleaned = '+' + cleaned;
  } else if (cleaned.startsWith('0')) {
    cleaned = '+94' + cleaned.substring(1);
  } else if (!cleaned.startsWith('+')) {
    cleaned = '+94' + cleaned;
  }
  
  // Format as +94 XX XXX XXXX
  const match = cleaned.match(/^(\+94)(\d{2})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
  }
  return cleaned;
};

const InfoItem: React.FC<{ 
  icon: string; 
  label: string; 
  value: string; 
  valueColor?: string;
}> = ({ icon, label, value, valueColor = COLORS.text.primary }) => (
  <View style={styles.infoItem}>
    <View style={styles.iconContainer}>
      <MaterialIcons name={icon as any} size={22} color={COLORS.primary} />
    </View>
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, { color: valueColor }]}>{value || 'Not provided'}</Text>
    </View>
  </View>
);

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: logout,
          style: 'destructive' 
        },
      ]
    );
  };

  const getInitials = (name: string) => {
    if (!name) return 'SG';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Profile Header Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials(user.fullName)}</Text>
          </View>
          <Text style={styles.userFullName}>{user.fullName}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        {/* Info Items List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT DETAILS</Text>
          <View style={styles.sectionCard}>
            <InfoItem 
              icon="phone" 
              label="Phone Number" 
              value={formatPhoneNumber(user.phoneNumber)} 
            />
            <View style={styles.divider} />
            <InfoItem 
              icon="email" 
              label="Email Address" 
              value={user.email} 
              valueColor={COLORS.text.secondary}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FARM INFORMATION</Text>
          <View style={styles.sectionCard}>
            <InfoItem 
              icon="agriculture" 
              label="Farm Name" 
              value={user.farmName || 'My Smart Farm'} 
            />
            <View style={styles.divider} />
            <InfoItem 
              icon="location-on" 
              label="Location" 
              value={user.location || 'Not Specified'} 
            />
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={24} color={COLORS.error} />
            <Text style={styles.logoutText}>Logout from SmartGovi</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>SmartGovi v1.0.0</Text>
          <Text style={styles.tagline}>Empowering Sri Lankan Farmers</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.large,
    color: COLORS.text.primary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  avatarText: {
    fontFamily: FONTS.bold,
    fontSize: 32,
    color: COLORS.white,
  },
  userFullName: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.secondary,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: COLORS.text.secondary,
    letterSpacing: 1.2,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderBottomWidth: 2, // Subtle depth
    borderColor: COLORS.border,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.text.secondary,
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: FONTS.bold, // Prominent value
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderStyle: 'dashed', // Differentiate it from other sections
  },
  logoutText: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.error,
    marginLeft: 12,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  versionText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.text.disabled,
  },
  tagline: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.text.disabled,
    marginTop: 4,
  },
});

export default ProfileScreen;