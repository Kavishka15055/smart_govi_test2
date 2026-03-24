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
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { COLORS, FONTS } from '../../utils/constants';
import { FarmSetupStackParamList, FarmType } from '../../types';
import { useFarmSetup } from '../../context/FarmContext';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import ProgressIndicator from '../../components/common/ProgressIndicator';
import CategoryChip from '../../components/common/CategoryChip';
import { MaterialIcons } from '@expo/vector-icons';

type IncomeSourcesScreenNavigationProp = StackNavigationProp<FarmSetupStackParamList, 'IncomeSources'>;
type IncomeSourcesScreenRouteProp = RouteProp<FarmSetupStackParamList, 'IncomeSources'>;

const IncomeSourcesScreen: React.FC = () => {
  const navigation = useNavigation<IncomeSourcesScreenNavigationProp>();
  const route = useRoute<IncomeSourcesScreenRouteProp>();
  const { farmType } = route.params;
  
  const { state, updateIncomeCategory, addCustomIncomeCategory, nextStep, prevStep } = useFarmSetup();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Filter categories for current farm type
  const currentCategories = state.incomeCategories.filter(
    cat => cat.farmType === farmType
  );

  const handleToggleCategory = (categoryId: string, currentSelected: boolean) => {
    updateIncomeCategory(categoryId, !currentSelected);
  };

  const handleAddToCategory = (categoryId: string) => {
    // This would typically add the category to a "quick add" list
    // For now, we'll just select it
    updateIncomeCategory(categoryId, true);
  };

  const handleAddCustomCategory = () => {
    if (newCategoryName.trim()) {
      addCustomIncomeCategory(newCategoryName.trim(), farmType);
      setNewCategoryName('');
      setModalVisible(false);
    }
  };

  const handleNext = () => {
    nextStep();
    navigation.navigate('ExpenseCategories');
  };

  const handleBack = () => {
    prevStep();
    navigation.goBack();
  };

  const getFarmTypeDisplay = (type: FarmType): string => {
    const map: Record<FarmType, string> = {
      mushrooms: 'MUSHROOM',
      vegetables: 'VEGETABLES',
      paddy: 'PADDY',
      fruits: 'FRUITS',
      poultry: 'POULTRY',
      other: 'OTHER',
    };
    return map[type] || type.toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Farm Setup" showBack onBackPress={handleBack} />
      
      <ProgressIndicator
        currentStep={2}
        totalSteps={3}
        labels={['Farm Type', 'Income', 'Expenses']}
      />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Your Income Sources</Text>
          <Text style={styles.farmTypeTitle}>{getFarmTypeDisplay(farmType)}</Text>

          <View style={styles.categoriesContainer}>
            {currentCategories.map((category) => (
              <CategoryChip
                key={category.id}
                label={category.name}
                selected={category.isSelected}
                onToggle={() => handleToggleCategory(category.id, category.isSelected)}
                onAddToList={() => handleAddToCategory(category.id)}
                showAddButton={!category.isSelected}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <MaterialIcons name="add-circle" size={24} color={COLORS.primary} />
            <Text style={styles.addButtonText}>Add New Income Source</Text>
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
            title="Next →"
            onPress={handleNext}
            style={styles.nextButton}
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
              <Text style={styles.modalTitle}>Add New Income Source</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={COLORS.text.secondary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Enter category name (e.g., King Oyster)"
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
  farmTypeTitle: {
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
  nextButton: {
    flex: 1,
    marginLeft: 8,
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

export default IncomeSourcesScreen;