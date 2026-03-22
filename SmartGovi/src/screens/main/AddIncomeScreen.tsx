import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS, FONTS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { useCategories } from '../../hooks/useCategories';
import { transactionService } from '../../services/transactionService';
import { IncomeFormData, PickerCategory } from '../../types';
import { validateIncomeForm, sanitizeAmount, sanitizeQuantity } from '../../utils/transactionValidators';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import DatePicker from '../../components/forms/DatePicker';
import CategoryPicker from '../../components/forms/CategoryPicker';
import QuantityInput from '../../components/forms/QuantityInput';
import SuccessModal from '../../components/common/SuccessModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';

type AddIncomeScreenNavigationProp = StackNavigationProp<any, 'AddIncome'>;

const AddIncomeScreen: React.FC = () => {
  const navigation = useNavigation<AddIncomeScreenNavigationProp>();
  const route = useRoute<RouteProp<any, 'AddIncome'>>();
  const editTransaction = route.params?.transaction;
  const isEdit = !!editTransaction;
  const { user } = useAuth();
  const { t } = useTranslation();
  const { categories, loading: categoriesLoading } = useCategories('income');

  const [formData, setFormData] = useState<IncomeFormData>({
    date: editTransaction?.date || new Date(),
    categoryId: editTransaction?.categoryId || '',
    categoryName: editTransaction?.categoryName || '',
    quantity: editTransaction?.quantity?.toString() || '',
    unit: editTransaction?.unit || 'kg',
    amount: editTransaction?.amount?.toString() || '',
    notes: editTransaction?.notes || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedAmount, setSubmittedAmount] = useState(0);
  const [submittedCategory, setSubmittedCategory] = useState('');

  useEffect(() => {
    // Set default unit when category changes
    if (formData.categoryId) {
      const selectedCategory = categories.find(c => c.id === formData.categoryId);
      if (selectedCategory?.defaultUnit) {
        setFormData(prev => ({ ...prev, unit: selectedCategory.defaultUnit! }));
      }
    }
  }, [formData.categoryId, categories]);

  const handleCategorySelect = (category: PickerCategory) => {
    setFormData({
      ...formData,
      categoryId: category.id,
      categoryName: category.name,
    });
    // Clear category error if exists
    if (errors.category) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.category;
        return newErrors;
      });
    }
  };

  const handleAmountChange = (value: string) => {
    const sanitized = sanitizeAmount(value);
    setFormData({ ...formData, amount: sanitized });
    if (errors.amount) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.amount;
        return newErrors;
      });
    }
  };

  const handleQuantityChange = (value: string) => {
    const sanitized = sanitizeQuantity(value);
    setFormData({ ...formData, quantity: sanitized });
    if (errors.quantity) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.quantity;
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    // Validate form
    const validation = validateIncomeForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in');
      return;
    }

    setIsSubmitting(true);

    try {
      const amountNum = parseFloat(formData.amount);
      const quantityNum = parseFloat(formData.quantity);

      if (isEdit) {
        await transactionService.updateTransaction('income', editTransaction.id, {
          date: formData.date,
          categoryId: formData.categoryId,
          categoryName: formData.categoryName,
          quantity: quantityNum,
          unit: formData.unit,
          amount: amountNum,
          notes: formData.notes.trim() || null,
        });
      } else {
        await transactionService.addIncome({
          userId: user.id,
          date: formData.date,
          categoryId: formData.categoryId,
          categoryName: formData.categoryName,
          quantity: quantityNum,
          unit: formData.unit,
          amount: amountNum,
          notes: formData.notes.trim() || null,
          type: 'income',
        });
      }

      // Store for success modal
      setSubmittedAmount(amountNum);
      setSubmittedCategory(formData.categoryName);

      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to add income. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Reset form
    setFormData({
      date: new Date(),
      categoryId: '',
      categoryName: '',
      quantity: '',
      unit: 'kg',
      amount: '',
      notes: '',
    });
    setErrors({});
  };

  const handleViewHistory = () => {
    setShowSuccessModal(false);
    navigation.navigate('History');
  };

  const handleAddAnother = () => {
    setShowSuccessModal(false);
    // Reset form
    setFormData({
      date: new Date(),
      categoryId: '',
      categoryName: '',
      quantity: '',
      unit: 'kg',
      amount: '',
      notes: '',
    });
    setErrors({});
  };

  if (categoriesLoading) {
    return <LoadingSpinner fullScreen message="Loading categories..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title={isEdit ? "Edit Income" : "Add Income"} 
        showBack 
        onBackPress={() => navigation.goBack()} 
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Date Picker */}
            <DatePicker
              label="Date"
              value={formData.date}
              onChange={(date) => setFormData({ ...formData, date })}
              maximumDate={new Date()}
            />

            {/* Category Picker */}
            <CategoryPicker
              categories={categories}
              selectedCategoryId={formData.categoryId}
              onSelectCategory={handleCategorySelect}
              error={errors.category}
            />

            {/* Quantity Input */}
            <QuantityInput
              quantity={formData.quantity}
              unit={formData.unit}
              onQuantityChange={handleQuantityChange}
              onUnitChange={(unit) => setFormData({ ...formData, unit })}
              error={errors.quantity}
            />

            {/* Amount Input */}
            <Input
              label="Amount (LKR)"
              value={formData.amount}
              onChangeText={handleAmountChange}
              placeholder="2500"
              keyboardType="numeric"
              icon="attach-money"
              error={errors.amount}
            />

            {/* Notes Input */}
            <Input
              label="Notes (Optional)"
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              placeholder="Sold at Colombo market..."
              multiline
              numberOfLines={3}
              icon="notes"
            />

            {/* Submit Button */}
            <Button
              title={isEdit ? "Update Income" : "Save Income"}
              onPress={handleSubmit}
              size="large"
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        type="income"
        amount={submittedAmount}
        categoryName={submittedCategory}
        isUpdate={isEdit}
        onClose={isEdit ? () => navigation.goBack() : handleSuccessClose}
        onViewHistory={handleViewHistory}
        onAddAnother={handleAddAnother}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardView: {
    flex: 1,
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
  submitButton: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default AddIncomeScreen;