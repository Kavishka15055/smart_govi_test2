import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { farmService } from '../../services/farmService';
import { transactionService } from '../../services/transactionService';
import { COLORS, FONTS } from '../../utils/constants';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Farm, FarmType, IncomeCategory, ExpenseCategory, FARM_TYPE_OPTIONS, DEFAULT_INCOME_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES } from '../../types';
import { MaterialIcons } from '@expo/vector-icons';

const EditFarmDetailsScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [farmId, setFarmId] = useState<string | null>(null);

  const [selectedTypes, setSelectedTypes] = useState<FarmType[]>([]);
  const [selectedIncomes, setSelectedIncomes] = useState<IncomeCategory[]>([]);
  const [selectedExpenses, setSelectedExpenses] = useState<ExpenseCategory[]>([]);
  const [customIncomes, setCustomIncomes] = useState<IncomeCategory[]>([]);
  const [customExpenses, setCustomExpenses] = useState<ExpenseCategory[]>([]);

  // Add Custom Income Modal State
  const [isAddIncomeModalVisible, setAddIncomeModalVisible] = useState(false);
  const [newIncomeName, setNewIncomeName] = useState('');
  const [newIncomeUnit, setNewIncomeUnit] = useState('kg');
  const [newIncomeFarmType, setNewIncomeFarmType] = useState<FarmType | null>(null);

  // Add Custom Expense Modal State
  const [isAddExpenseModalVisible, setAddExpenseModalVisible] = useState(false);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseFarmType, setNewExpenseFarmType] = useState<FarmType | null>(null);

  useEffect(() => {
    loadFarmData();
  }, [user]);

  const loadFarmData = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const data = await farmService.getFarmProfile(user.id);
      if (data) {
        setFarmId(data.id);
        setSelectedTypes(data.types || []);
        setSelectedIncomes(data.incomeCategories || []);
        setSelectedExpenses(data.expenseCategories || []);
        
        // Extract custom incomes & expenses
        const loadedCustomIncomes = (data.incomeCategories || []).filter(c => c.id.startsWith('custom_'));
        setCustomIncomes(loadedCustomIncomes);
        
        const loadedCustomExpenses = (data.expenseCategories || []).filter(c => c.id.startsWith('custom_'));
        setCustomExpenses(loadedCustomExpenses);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load farm details');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFarmType = (type: FarmType) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) return prev.filter(t => t !== type);
      return [...prev, type];
    });
  };

  const availableIncomes = selectedTypes.flatMap(type => [
    ...(DEFAULT_INCOME_CATEGORIES[type] || []),
    ...customIncomes.filter(c => c.farmType === type)
  ]);
  const availableExpenses = selectedTypes.flatMap(type => [
    ...(DEFAULT_EXPENSE_CATEGORIES[type] || []),
    ...customExpenses.filter(c => c.farmType === type)
  ]);

  const toggleIncome = async (income: IncomeCategory) => {
    const isCurrentlySelected = selectedIncomes.some(i => i.id === income.id);

    if (isCurrentlySelected) {
      const validIncomes = selectedIncomes.filter(i => selectedTypes.includes(i.farmType));
      
      const performUncheck = () => {
        setSelectedIncomes(prev => prev.filter(i => i.id !== income.id));
        if (validIncomes.length === 1) {
          Alert.alert('Warning', 'You need at least one income source to add income transactions');
        }
      };

      setIsLoading(true);
      const count = await transactionService.getCategoryTransactionCount(income.id);
      setIsLoading(false);

      if (count > 0) {
        Alert.alert(
          'Warning',
          `This category has ${count} transactions. Removing it will hide these from future selections but won't delete them.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Remove', 
              style: 'destructive',
              onPress: performUncheck
            }
          ]
        );
      } else {
        performUncheck();
      }
    } else {
      setSelectedIncomes(prev => [...prev, { ...income, isSelected: true }]);
    }
  };

  const toggleExpense = async (expense: ExpenseCategory) => {
    const isCurrentlySelected = selectedExpenses.some(e => e.id === expense.id);

    if (isCurrentlySelected) {
      const validExpenses = selectedExpenses.filter(e => selectedTypes.includes(e.farmType));
      
      const performUncheck = () => {
        setSelectedExpenses(prev => prev.filter(e => e.id !== expense.id));
        if (validExpenses.length === 1) {
          Alert.alert('Warning', 'You need at least one expense category to add expense transactions');
        }
      };

      setIsLoading(true);
      const count = await transactionService.getCategoryTransactionCount(expense.id);
      setIsLoading(false);

      if (count > 0) {
        Alert.alert(
          'Warning',
          `This category has ${count} transactions. Removing it will hide these from future selections but won't delete them.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Remove', 
              style: 'destructive',
              onPress: performUncheck
            }
          ]
        );
      } else {
        performUncheck();
      }
    } else {
      setSelectedExpenses(prev => [...prev, { ...expense, isSelected: true }]);
    }
  };

  // Delete Handlers for completely eradicating custom categories exclusively
  const handleDeleteCustomIncome = async (income: IncomeCategory) => {
    const inUse = await transactionService.isCategoryInUse(income.id);
    if (inUse) {
      Alert.alert('Cannot Delete', 'This custom category is already used in existing transactions.');
      return;
    }

    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${income.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setCustomIncomes(prev => prev.filter(c => c.id !== income.id));
            setSelectedIncomes(prev => prev.filter(c => c.id !== income.id));
          }
        }
      ]
    );
  };

  const handleDeleteCustomExpense = async (expense: ExpenseCategory) => {
    const inUse = await transactionService.isCategoryInUse(expense.id);
    if (inUse) {
      Alert.alert('Cannot Delete', 'This custom category is already used in existing transactions.');
      return;
    }

    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${expense.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setCustomExpenses(prev => prev.filter(c => c.id !== expense.id));
            setSelectedExpenses(prev => prev.filter(c => c.id !== expense.id));
          }
        }
      ]
    );
  };

  // Add Custom Creation Handlers
  const handleSaveCustomIncome = () => {
    if (!newIncomeName.trim() || !newIncomeFarmType) {
      Alert.alert('Error', 'Please provide a name and select a farm type.');
      return;
    }

    const newIncome: IncomeCategory = {
      id: `custom_${Date.now()}`,
      name: newIncomeName.trim(),
      defaultUnit: newIncomeUnit.trim() || 'units',
      farmType: newIncomeFarmType,
      isSelected: true
    };

    setCustomIncomes(prev => [...prev, newIncome]);
    setSelectedIncomes(prev => [...prev, newIncome]);
    
    setAddIncomeModalVisible(false);
    setNewIncomeName('');
    setNewIncomeUnit('kg');
    setNewIncomeFarmType(null);
  };

  const handleSaveCustomExpense = () => {
    if (!newExpenseName.trim() || !newExpenseFarmType) {
      Alert.alert('Error', 'Please provide a name and select a farm type.');
      return;
    }

    const newExpense: ExpenseCategory = {
      id: `custom_${Date.now()}`,
      name: newExpenseName.trim(),
      farmType: newExpenseFarmType,
      isSelected: true
    };

    setCustomExpenses(prev => [...prev, newExpense]);
    setSelectedExpenses(prev => [...prev, newExpense]);
    
    setAddExpenseModalVisible(false);
    setNewExpenseName('');
    setNewExpenseFarmType(null);
  };

  const validIncomesSaveCheck = selectedIncomes.filter(i => selectedTypes.includes(i.farmType));
  const validExpensesSaveCheck = selectedExpenses.filter(e => selectedTypes.includes(e.farmType));
  const isSaveDisabled = selectedTypes.length === 0 || validIncomesSaveCheck.length === 0 || validExpensesSaveCheck.length === 0;

  const handleSave = async () => {
    if (!user || !farmId) return;

    if (isSaveDisabled) {
      Alert.alert('Warning', 'You must select at least one Farm Type, Income Source, and Expense Category prior to saving.');
      return;
    }

    setIsSaving(true);
    try {
      await farmService.updateFarmProfile(farmId, {
        types: selectedTypes,
        incomeCategories: validIncomesSaveCheck,
        expenseCategories: validExpensesSaveCheck,
      });
      Alert.alert('Success', 'Farm details updated! Reload Profile to see changes.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update farm details');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Edit Farm Details" showBack={true} onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.sectionTitle}>Farm Types</Text>
        <View style={styles.typesContainer}>
          {FARM_TYPE_OPTIONS.map(option => {
            const isSelected = selectedTypes.includes(option.id);
            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.typeCard, isSelected && styles.typeCardSelected]}
                onPress={() => toggleFarmType(option.id)}
              >
                <View style={styles.cardCheckboxContainer}>
                  <MaterialIcons 
                    name={isSelected ? "check-box" : "check-box-outline-blank"} 
                    size={20} 
                    color={isSelected ? COLORS.primary : COLORS.text.disabled} 
                  />
                </View>
                <Text style={styles.typeEmoji}>{option.emoji}</Text>
                <Text style={[styles.typeLabel, isSelected && styles.typeLabelSelected]}>{option.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedTypes.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Income Sources</Text>
            {selectedTypes.map(type => {
              const typeLabel = FARM_TYPE_OPTIONS.find(o => o.id === type)?.label;
              const typeIncomes = availableIncomes.filter(i => i.farmType === type);
              if (typeIncomes.length === 0) return null;
              
              return (
                <View key={`income-${type}`} style={styles.categoryGroup}>
                  <Text style={styles.categoryGroupTitle}>{typeLabel} Income</Text>
                  {typeIncomes.map(income => {
                    const isSelected = selectedIncomes.some(i => i.id === income.id);
                    const isCustom = income.id.startsWith('custom_');
                    return (
                      <View key={income.id} style={styles.itemRowWrapper}>
                        <TouchableOpacity
                          style={[styles.itemRow, { flex: 1 }]}
                          onPress={() => toggleIncome(income)}
                        >
                          <MaterialIcons 
                            name={isSelected ? "check-box" : "check-box-outline-blank"} 
                            size={24} 
                            color={isSelected ? COLORS.primary : COLORS.text.secondary} 
                          />
                          <Text style={styles.itemText}>{income.name}</Text>
                          {isCustom && (
                            <View style={styles.customBadge}>
                              <Text style={styles.customBadgeText}>Custom</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                        {isCustom && (
                          <TouchableOpacity 
                            style={styles.deleteButton}
                            onPress={() => handleDeleteCustomIncome(income)}
                          >
                            <MaterialIcons name="delete-outline" size={24} color={COLORS.error} />
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })}
                </View>
              );
            })}

            <Button
              title="+ Add New Income Source"
              onPress={() => setAddIncomeModalVisible(true)}
              variant="outline"
              style={{ marginBottom: 24 }}
            />

            <Text style={styles.sectionTitle}>Expense Categories</Text>
            {selectedTypes.map(type => {
              const typeLabel = FARM_TYPE_OPTIONS.find(o => o.id === type)?.label;
              const typeExpenses = availableExpenses.filter(e => e.farmType === type);
              if (typeExpenses.length === 0) return null;
              
              return (
                <View key={`expense-${type}`} style={styles.categoryGroup}>
                  <Text style={styles.categoryGroupTitle}>{typeLabel} Expenses</Text>
                  {typeExpenses.map(expense => {
                    const isSelected = selectedExpenses.some(e => e.id === expense.id);
                    const isCustom = expense.id.startsWith('custom_');
                    return (
                      <View key={expense.id} style={styles.itemRowWrapper}>
                        <TouchableOpacity
                          style={[styles.itemRow, { flex: 1 }]}
                          onPress={() => toggleExpense(expense)}
                        >
                          <MaterialIcons 
                            name={isSelected ? "check-box" : "check-box-outline-blank"} 
                            size={24} 
                            color={isSelected ? COLORS.primary : COLORS.text.secondary} 
                          />
                          <Text style={styles.itemText}>{expense.name}</Text>
                          {isCustom && (
                            <View style={styles.customBadge}>
                              <Text style={styles.customBadgeText}>Custom</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                        {isCustom && (
                          <TouchableOpacity 
                            style={styles.deleteButton}
                            onPress={() => handleDeleteCustomExpense(expense)}
                          >
                            <MaterialIcons name="delete-outline" size={24} color={COLORS.error} />
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })}
                </View>
              );
            })}

            <Button
              title="+ Add Custom Expense"
              onPress={() => setAddExpenseModalVisible(true)}
              variant="outline"
              style={{ marginBottom: 24 }}
            />

          </>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="outline"
            disabled={isSaving}
            style={styles.actionButton}
          />
          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={isSaving}
            style={styles.actionButton}
            disabled={isSaveDisabled}
          />
        </View>
      </ScrollView>

      {/* Add Custom Income Modal */}
      <Modal
        visible={isAddIncomeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAddIncomeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Custom Income</Text>
            
            <Input
              label="Income Source Name"
              value={newIncomeName}
              onChangeText={setNewIncomeName}
              placeholder="e.g. Honeycomb"
            />
            
            <Input
              label="Default Unit"
              value={newIncomeUnit}
              onChangeText={setNewIncomeUnit}
              placeholder="e.g. kg, liters, boxes"
            />
            
            <Text style={styles.pickerLabel}>Associated Farm Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
              {selectedTypes.map(type => {
                const opt = FARM_TYPE_OPTIONS.find(o => o.id === type);
                const isSelected = newIncomeFarmType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.pickerChip, isSelected && styles.pickerChipSelected]}
                    onPress={() => setNewIncomeFarmType(type)}
                  >
                    <Text style={styles.chipEmoji}>{opt?.emoji}</Text>
                    <Text style={[styles.pickerChipText, isSelected && styles.pickerChipTextSelected]}>
                      {opt?.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.modalButtonContainer}>
              <Button
                title="Cancel"
                onPress={() => setAddIncomeModalVisible(false)}
                variant="outline"
                style={styles.actionButton}
              />
              <Button
                title="Add Source"
                onPress={handleSaveCustomIncome}
                style={styles.actionButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Custom Expense Modal */}
      <Modal
        visible={isAddExpenseModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAddExpenseModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Custom Expense</Text>
            
            <Input
              label="Expense Category Name"
              value={newExpenseName}
              onChangeText={setNewExpenseName}
              placeholder="e.g. Tractor Maintenance"
            />
            
            <Text style={styles.pickerLabel}>Associated Farm Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
              {selectedTypes.map(type => {
                const opt = FARM_TYPE_OPTIONS.find(o => o.id === type);
                const isSelected = newExpenseFarmType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.pickerChip, isSelected && styles.pickerChipSelected]}
                    onPress={() => setNewExpenseFarmType(type)}
                  >
                    <Text style={styles.chipEmoji}>{opt?.emoji}</Text>
                    <Text style={[styles.pickerChipText, isSelected && styles.pickerChipTextSelected]}>
                      {opt?.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.modalButtonContainer}>
              <Button
                title="Cancel"
                onPress={() => setAddExpenseModalVisible(false)}
                variant="outline"
                style={styles.actionButton}
              />
              <Button
                title="Add Category"
                onPress={handleSaveCustomExpense}
                style={styles.actionButton}
              />
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.text.primary, marginTop: 20, marginBottom: 12 },
  typesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  typeCard: {
    width: '46%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
  },
  cardCheckboxContainer: { position: 'absolute', top: 8, right: 8 },
  typeCardSelected: { borderColor: COLORS.primary, backgroundColor: '#F0F7F0' },
  typeEmoji: { fontSize: 32, marginBottom: 8 },
  typeLabel: { fontFamily: FONTS.medium, fontSize: 14, color: COLORS.text.secondary },
  typeLabelSelected: { color: COLORS.primary, fontFamily: FONTS.bold },
  
  categoryGroup: { marginBottom: 16, backgroundColor: COLORS.white, borderRadius: 12, padding: 0, overflow: 'hidden' },
  categoryGroupTitle: { fontFamily: FONTS.bold, fontSize: 14, color: COLORS.text.primary, padding: 16, paddingBottom: 8, backgroundColor: '#FAFAFA' },
  itemRowWrapper: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: COLORS.white },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 },
  itemText: { fontFamily: FONTS.medium, fontSize: 15, color: COLORS.text.primary, marginLeft: 12 },
  
  customBadge: { backgroundColor: COLORS.lightGray, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, marginLeft: 8 },
  customBadgeText: { fontFamily: FONTS.regular, fontSize: 10, color: COLORS.text.secondary },
  
  deleteButton: { padding: 12, justifyContent: 'center', alignItems: 'center' },
  
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 32, gap: 16 },
  actionButton: { flex: 1 },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: COLORS.white, borderRadius: 16, padding: 24, elevation: 5 },
  modalTitle: { fontFamily: FONTS.bold, fontSize: 18, color: COLORS.text.primary, marginBottom: 20 },
  pickerLabel: { fontFamily: FONTS.medium, fontSize: 14, color: COLORS.text.secondary, marginBottom: 8, marginTop: 8 },
  pickerScroll: { flexDirection: 'row', marginBottom: 24 },
  pickerChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.lightGray, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: COLORS.border },
  pickerChipSelected: { backgroundColor: '#F0F7F0', borderColor: COLORS.primary },
  pickerChipText: { fontFamily: FONTS.medium, fontSize: 14, color: COLORS.text.secondary, marginLeft: 4 },
  pickerChipTextSelected: { color: COLORS.primary, fontFamily: FONTS.bold },
  chipEmoji: { fontSize: 16 },
  modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
});

export default EditFarmDetailsScreen;
