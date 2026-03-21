import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { COLORS, FONTS } from '../../utils/constants';

import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const EditProfileScreen: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigation = useNavigation();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [farmName, setFarmName] = useState(user?.farmName || '');
  const [location, setLocation] = useState(user?.location || '');
  
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    let newErrors: { [key: string]: string } = {};
    if (!fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
    } else if (!/^\d{9,10}$/.test(phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Enter a valid phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!user) return;
    if (!validate()) return;

    setIsSaving(true);
    try {
      const updatedData = {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        farmName: farmName.trim(),
        location: location.trim(),
      };

      await authService.updateUserProfile(user.id, updatedData);
      await updateUser(updatedData);

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Edit Profile" 
        showBack={true} 
        onBackPress={() => navigation.goBack()} 
      />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Input
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            error={errors.fullName}
            placeholder="Enter your full name"
            icon="person"
          />
          
          <Input
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            error={errors.phoneNumber}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            icon="phone"
          />

          <Input
            label="Farm Name (Optional)"
            value={farmName}
            onChangeText={setFarmName}
            placeholder="Enter your farm name"
            icon="agriculture"
          />

          <Input
            label="Location (Optional)"
            value={location}
            onChangeText={setLocation}
            placeholder="Enter your location / district"
            icon="location-on"
          />

          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={isSaving}
            style={styles.saveButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  saveButton: {
    marginTop: 24,
  },
});

export default EditProfileScreen;
