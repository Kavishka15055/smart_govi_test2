import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONTS } from '../../utils/constants';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { storageService } from '../../services/storageService';
import { authService } from '../../services/authService';
import { farmService } from '../../services/farmService';
import { Farm, FARM_TYPE_OPTIONS } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ActivityIndicator } from 'react-native';

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
  const { user, logout, updateUser } = useAuth();
  const navigation = useNavigation<any>();
  const [isUploading, setIsUploading] = useState(false);
  
  const [farmData, setFarmData] = useState<Farm | null>(null);
  const [isLoadingFarm, setIsLoadingFarm] = useState(true);
  const [showAboutModal, setShowAboutModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadFarmData();
      }
    }, [user])
  );

  const loadFarmData = async () => {
    try {
      setIsLoadingFarm(true);
      const data = await farmService.getFarmProfile(user!.id);
      setFarmData(data);
    } catch (error) {
      console.error('Failed to load farm details:', error);
    } finally {
      setIsLoadingFarm(false);
    }
  };

  const handleEditPhoto = () => {
    const options: any[] = [
      { text: 'Take Photo', onPress: () => handleImagePick('camera') },
      { text: 'Choose from Gallery', onPress: () => handleImagePick('gallery') },
    ];

    if (user?.profilePhotoUrl) {
      options.push({ 
        text: 'Remove Photo', 
        onPress: confirmRemovePhoto,
        style: 'destructive' 
      });
    }

    options.push({ text: 'Cancel', style: 'cancel' });

    Alert.alert(
      'Profile Photo',
      'Choose an option',
      options
    );
  };

  const confirmRemovePhoto = () => {
    Alert.alert(
      'Remove profile photo?',
      'Are you sure you want to remove your profile photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: removePhoto
        }
      ]
    );
  };

  const removePhoto = async () => {
    if (!user || !user.profilePhotoUrl) return;
    
    setIsUploading(true);
    try {
      await storageService.deleteProfilePhoto(user.profilePhotoUrl);
      await authService.updateUserProfile(user.id, { profilePhotoUrl: "" });
      await updateUser({ profilePhotoUrl: "" });
      Alert.alert('Success', 'Profile photo removed successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to remove profile photo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImagePick = async (mode: 'camera' | 'gallery') => {
    try {
      let result;
      
      if (mode === 'camera') {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
          Alert.alert('Permission Denied', 'Camera permission is required to take a photo.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
        });
      } else {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
          Alert.alert('Permission Denied', 'Gallery permission is required to pick a photo.');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        uploadPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const uploadPhoto = async (uri: string) => {
    if (!user) return;
    setIsUploading(true);
    try {
      const downloadURL = await storageService.uploadProfilePhoto(uri, user.id);
      await authService.updateUserProfile(user.id, { profilePhotoUrl: downloadURL });
      await updateUser({ profilePhotoUrl: downloadURL });
      Alert.alert('Success', 'Profile photo updated successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to upload profile photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

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

  if (isUploading) {
    return <LoadingSpinner fullScreen message="Uploading Profile Photo..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <MaterialIcons name="edit" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Profile Header Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarContainer}>
              {user.profilePhotoUrl ? (
                <Image 
                  source={{ uri: user.profilePhotoUrl }} 
                  style={styles.avatarImage} 
                />
              ) : (
                <Text style={styles.avatarText}>{getInitials(user.fullName)}</Text>
              )}
            </View>
            <TouchableOpacity 
              style={styles.editPhotoBadge} 
              activeOpacity={0.8}
              onPress={handleEditPhoto}
            >
              <MaterialIcons name="camera-alt" size={16} color={COLORS.white} />
            </TouchableOpacity>
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

        {/* Farm Setup Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>FARM SETTINGS / DETAILS</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EditFarmDetails')} style={styles.sectionEditIcon}>
              <MaterialIcons name="edit" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.sectionCard}>
            {isLoadingFarm ? (
              <View style={{ padding: 24, alignItems: 'center' }}>
                <ActivityIndicator color={COLORS.primary} />
              </View>
            ) : !farmData ? (
              <View style={{ padding: 20 }}>
                <Text style={styles.emptyText}>
                  No farm setup found.
                </Text>
              </View>
            ) : (
              <View style={{ padding: 16 }}>
                <Text style={[styles.subHeading, { marginTop: 0 }]}>Farm Types</Text>
                <View style={styles.chipContainer}>
                  {farmData.types && farmData.types.length > 0 ? farmData.types.map(type => {
                    const opt = FARM_TYPE_OPTIONS.find(o => o.id === type);
                    return (
                      <View key={type} style={styles.chip}>
                        <Text style={styles.chipEmoji}>{opt?.emoji || '🌱'}</Text>
                        <Text style={styles.chipText}>{opt?.label || type}</Text>
                      </View>
                    );
                  }) : <Text style={styles.emptyText}>No farm types selected</Text>}
                </View>

                <View style={styles.dividerContainer} />

                <Text style={styles.subHeading}>Income Sources</Text>
                <View style={styles.chipContainer}>
                  {farmData.incomeCategories && farmData.incomeCategories.length > 0 ? farmData.incomeCategories.map(cat => (
                    <View key={cat.id} style={[styles.chip, styles.incomeChip]}>
                      <MaterialIcons name="check-circle" size={14} color="#2E7D32" style={{ marginRight: 4 }} />
                      <Text style={[styles.chipText, { color: '#1B5E20' }]}>{cat.name}</Text>
                    </View>
                  )) : <Text style={styles.emptyText}>No income sources configured</Text>}
                </View>

                <View style={styles.dividerContainer} />

                <Text style={styles.subHeading}>Expense Categories</Text>
                <View style={styles.chipContainer}>
                  {farmData.expenseCategories && farmData.expenseCategories.length > 0 ? farmData.expenseCategories.map(cat => (
                    <View key={cat.id} style={[styles.chip, styles.expenseChip]}>
                      <MaterialIcons name="check-circle" size={14} color="#C62828" style={{ marginRight: 4 }} />
                      <Text style={[styles.chipText, { color: '#B71C1C' }]}>{cat.name}</Text>
                    </View>
                  )) : <Text style={styles.emptyText}>No expense categories configured</Text>}
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APP</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity 
              style={styles.actionItem} 
              onPress={() => setShowAboutModal(true)}
            >
              <View style={styles.actionIconContainer}>
                <MaterialIcons name="info-outline" size={22} color={COLORS.primary} />
              </View>
              <Text style={styles.actionItemText}>About GoviGanana</Text>
              <MaterialIcons name="chevron-right" size={24} color={COLORS.border} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.section, { marginTop: 32 }]}>
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={24} color={COLORS.error} />
            <Text style={styles.logoutText}>Logout from SmartGovi</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>GoviGanana v1.0.0</Text>
          <Text style={styles.tagline}>Your Farm Financial Companion</Text>
        </View>
      </ScrollView>

      {/* About Modal */}
      <Modal
        visible={showAboutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAboutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalLogoContainer}>
              <MaterialIcons name="agriculture" size={48} color={COLORS.primary} />
            </View>
            <Text style={styles.modalTitle}>GoviGanana</Text>
            <Text style={styles.modalVersion}>Version 1.0.0</Text>
            
            <View style={styles.modalDivider} />
            
            <Text style={styles.modalDescription}>
              Your Farm Financial Companion
            </Text>
            <Text style={styles.modalDetailText}>
              Empowering Sri Lankan farmers with smart financial tracking and agricultural management tools.
            </Text>
            
            <Text style={styles.modalCopyright}>
              © {new Date().getFullYear()} GoviGanana. All rights reserved.
            </Text>

            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowAboutModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editPhotoBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingRight: 4,
  },
  sectionEditIcon: {
    padding: 4,
  },
  subHeading: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.text.primary,
    marginBottom: 8,
    marginTop: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  chipText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.text.primary,
  },
  incomeChip: {
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7',
  },
  expenseChip: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
  },
  emptyText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
    paddingVertical: 4,
  },
  dividerContainer: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F7F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionItemText: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalLogoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F7F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  modalVersion: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 24,
  },
  modalDivider: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 24,
  },
  modalDescription: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  modalDetailText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  modalCopyright: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.text.disabled,
    marginBottom: 24,
  },
  modalButton: {
    width: '100%',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.white,
  },
});

export default ProfileScreen;