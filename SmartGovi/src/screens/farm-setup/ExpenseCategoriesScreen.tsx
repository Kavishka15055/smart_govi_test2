import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS, FONTS } from '../../utils/constants';
import { FarmSetupStackParamList } from '../../types';
import { useFarmSetup } from '../../context/FarmContext';
import { useAuth } from '../../context/AuthContext';
import { farmService } from '../../services/farmService';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import ProgressIndicator from '../../components/common/ProgressIndicator';
import CategoryChip from '../../components/common/CategoryChip';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { MaterialIcons } from '@expo/vector-icons';

type ExpenseCategoriesScreenNavigationProp = StackNavigationProp<FarmSetupStackParamList, 'ExpenseCategories'>;

const ExpenseCategoriesScreen: React.FC = () => {
  const navigation = useNavigation<ExpenseCategoriesScreenNavigationProp>();
  const { user, updateUser } = useAuth();
  const { 
    state, 
    updateExpenseCategory, 
    addCustomExpenseCategory, 
    prevStep, 
    completeSetup 
  } = useFarmSetup();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleCategory = (categoryId: string, currentSelected: boolean) => {
    updateExpenseCategory(categoryId, !currentSelected);
  };

  const handleAddCustomCategory = () => {
    if (newCategoryName.trim()) {
      // For custom categories, we'll associate with the first farm type
      const primaryFarmType = state.selectedFarmTypes[0];
      addCustomExpenseCategory(newCategoryName.trim(), primaryFarmType);
      setNewCategoryName('');
      setModalVisible(false);
    }
  };

  const handleFinish = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      await farmService.saveFarmProfile(user.id, state);
      completeSetup();
      
      Alert.alert(
        'Success',
        'Farm setup completed successfully!',
        [
          {
            text: 'Go to Dashboard',
            onPress: async () => {
              // Trigger AppNavigator re-check by updating user context
              await updateUser({});
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save farm profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    prevStep();
    navigation.goBack();
  };

  if (isSaving) {
    return <LoadingSpinner fullScreen message="Saving your farm profile..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Farm Setup" showBack onBackPress={handleBack} />
      
      <ProgressIndicator
        currentStep={3}
        totalSteps={3}
        labels={['Farm Type', 'Income', 'Expenses']}
      />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Your Expense Categories</Text>
          <Text style={styles.subtitle}>Selected for your farm</Text>

          <View style={styles.categoriesContainer}>
            {state.expenseCategories.map((category) => (
              <CategoryChip
                key={category.id}
                label={category.name}
                selected={category.isSelected}
                onToggle={() => handleToggleCategory(category.id, category.isSelected)}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <MaterialIcons name="add-circle" size={24} color={COLORS.primary} />
            <Text style={styles.addButtonText}>Add Custom Expense</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.buttonRow}>
          <Button
            title="← Back"
            onPress={handleBack}
            variant="outline"
            style={styles.backButton}
          />
          <Button
            title="Finish"
            onPress={handleFinish}
            style={styles.finishButton}
          />
        </View>
      </View>

      {/* Add Custom Category Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Custom Expense</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={COLORS.text.secondary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Enter expense name (e.g., Electricity)"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Add"
                onPress={handleAddCustomCategory}
                style={styles.modalButton}
                disabled={!newCategoryName.trim()}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
    fontSize: FONTS.sizes.xlarge,
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.medium,
    color: COLORS.primary,
    marginBottom: 20,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    marginTop: 10,
  },
  addButtonText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.medium,
    color: COLORS.primary,
    marginLeft: 10,
  },
  bottomContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    flex: 1,
    marginRight: 8,
  },
  finishButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: COLORS.success,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 200,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.large,
    color: COLORS.text.primary,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.medium,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default ExpenseCategoriesScreen;