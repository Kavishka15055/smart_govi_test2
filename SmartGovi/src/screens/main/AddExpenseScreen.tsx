import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS, FONTS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { useCategories } from '../../hooks/useCategories';
import { transactionService } from '../../services/transactionService';
import { ExpenseFormData } from '../../types';
import { validateExpenseForm, sanitizeAmount } from '../../utils/transactionValidators';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import DatePicker from '../../components/forms/DatePicker';
import CategoryPicker from '../../components/forms/CategoryPicker';
import ImagePicker from '../../components/forms/ImagePicker';
import SuccessModal from '../../components/common/SuccessModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

type AddExpenseScreenNavigationProp = StackNavigationProp<any, 'AddExpense'>;

const AddExpenseScreen: React.FC = () => {
  const navigation = useNavigation<AddExpenseScreenNavigationProp>();
  const { user } = useAuth();
  const { categories, loading: categoriesLoading } = useCategories('expense');

  const [formData, setFormData] = useState<ExpenseFormData>({
    date: new Date(),
    categoryId: '',
    categoryName: '',
    amount: '',
    notes: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedAmount, setSubmittedAmount] = useState(0);
  const [submittedCategory, setSubmittedCategory] = useState('');
  const [selectedImage, setSelectedImage] = useState<any>();

  const handleCategorySelect = (category: any) => {
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

  const handleImageSelected = (image: any) => {
    setSelectedImage(image);
  };

  const handleImageRemoved = () => {
    setSelectedImage(undefined);
  };

  const handleSubmit = async () => {
    // Validate form
    const validation = validateExpenseForm(formData);
    
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

      // TODO: Upload image to Firebase Storage if selected
      let receiptUrl = undefined;
      if (selectedImage) {
        // Upload image logic here
        // receiptUrl = await uploadImage(selectedImage);
      }

      await transactionService.addExpense({
        userId: user.id,
        date: formData.date,
        categoryId: formData.categoryId,
        categoryName: formData.categoryName,
        amount: amountNum,
        notes: formData.notes.trim() || null,
        receiptUrl: receiptUrl || null,
        type: 'expense',
      });

      // Store for success modal
      setSubmittedAmount(amountNum);
      setSubmittedCategory(formData.categoryName);

      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to add expense. Please try again.');
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
      amount: '',
      notes: '',
    });
    setSelectedImage(undefined);
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
      amount: '',
      notes: '',
    });
    setSelectedImage(undefined);
    setErrors({});
  };

  if (categoriesLoading) {
    return <LoadingSpinner fullScreen message="Loading categories..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Add Expense" showBack onBackPress={() => navigation.goBack()} />
      
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

            {/* Amount Input */}
            <Input
              label="Amount (LKR)"
              value={formData.amount}
              onChangeText={handleAmountChange}
              placeholder="1250"
              keyboardType="numeric"
              icon="attach-money"
              error={errors.amount}
            />

            {/* Notes Input */}
            <Input
              label="Notes (Optional)"
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              placeholder="Bought from local supplier..."
              multiline
              numberOfLines={3}
              icon="notes"
            />

            {/* Image Picker for Receipt */}
            <ImagePicker
              onImageSelected={handleImageSelected}
              onImageRemoved={handleImageRemoved}
              selectedImage={selectedImage}
            />

            {/* Submit Button */}
            <Button
              title="Save Expense"
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
        type="expense"
        amount={submittedAmount}
        categoryName={submittedCategory}
        onClose={handleSuccessClose}
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

export default AddExpenseScreen;