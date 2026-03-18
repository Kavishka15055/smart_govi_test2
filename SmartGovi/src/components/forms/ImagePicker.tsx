import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import { COLORS, FONTS } from '../../utils/constants';
import { MaterialIcons } from '@expo/vector-icons';

interface ImagePickerProps {
  onImageSelected: (image: { uri: string; fileName: string; fileSize: number }) => void;
  onImageRemoved?: () => void;
  selectedImage?: { uri: string; fileName: string; fileSize: number };
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  onImageSelected,
  onImageRemoved,
  selectedImage,
}) => {
  const requestPermission = async () => {
    const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to attach receipts');
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const { status } = await ExpoImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take photos');
      return;
    }

    const result = await ExpoImagePicker.launchCameraAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      onImageSelected({
        uri: asset.uri,
        fileName: asset.fileName || `receipt_${Date.now()}.jpg`,
        fileSize: asset.fileSize || 0,
      });
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      onImageSelected({
        uri: asset.uri,
        fileName: asset.fileName || `receipt_${Date.now()}.jpg`,
        fileSize: asset.fileSize || 0,
      });
    }
  };

  const showOptions = () => {
    Alert.alert(
      'Attach Receipt',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleRemove = () => {
    Alert.alert(
      'Remove Receipt',
      'Are you sure you want to remove this receipt?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          onPress: () => onImageRemoved?.(),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Attach Receipt (Optional)</Text>
      
      {selectedImage ? (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
          <View style={styles.imageOverlay}>
            <Text style={styles.imageName} numberOfLines={1}>
              {selectedImage.fileName}
            </Text>
            <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
              <MaterialIcons name="delete" size={20} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={takePhoto}>
            <MaterialIcons name="camera-alt" size={24} color={COLORS.primary} />
            <Text style={styles.optionText}>Take Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionButton} onPress={pickImage}>
            <MaterialIcons name="photo-library" size={24} color={COLORS.primary} />
            <Text style={styles.optionText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
  },
  optionButton: {
    alignItems: 'center',
    padding: 8,
  },
  optionText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.primary,
    marginTop: 4,
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  imageName: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.white,
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
});

export default ImagePicker;