import React, { createContext, useState, useContext, ReactNode } from 'react';
import { 
  FarmType, 
  IncomeCategory, 
  ExpenseCategory, 
  FarmSetupState,
  DEFAULT_INCOME_CATEGORIES,
  DEFAULT_EXPENSE_CATEGORIES
} from '../types';

interface FarmContextType {
  state: FarmSetupState;
  selectFarmTypes: (types: FarmType[]) => void;
  updateIncomeCategory: (categoryId: string, isSelected: boolean) => void;
  updateExpenseCategory: (categoryId: string, isSelected: boolean) => void;
  addCustomIncomeCategory: (name: string, farmType: FarmType) => void;
  addCustomExpenseCategory: (name: string, farmType: FarmType) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetSetup: () => void;
  completeSetup: () => void;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const useFarmSetup = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarmSetup must be used within FarmProvider');
  }
  return context;
};

interface FarmProviderProps {
  children: ReactNode;
}

export const FarmProvider: React.FC<FarmProviderProps> = ({ children }) => {
  const [state, setState] = useState<FarmSetupState>({
    currentStep: 1,
    selectedFarmTypes: [],
    incomeCategories: [],
    expenseCategories: [],
    isCompleted: false,
  });

  const selectFarmTypes = (types: FarmType[]) => {
    // Load default categories based on selected farm types
    const incomeCats: IncomeCategory[] = [];
    const expenseCats: ExpenseCategory[] = [];

    types.forEach(type => {
      // Add income categories for this type
      const typeIncomeCats = DEFAULT_INCOME_CATEGORIES[type] || [];
      incomeCats.push(...typeIncomeCats);

      // Add expense categories for this type
      const typeExpenseCats = DEFAULT_EXPENSE_CATEGORIES[type] || [];
      expenseCats.push(...typeExpenseCats);
    });

    setState(prev => ({
      ...prev,
      selectedFarmTypes: types,
      incomeCategories: incomeCats,
      expenseCategories: expenseCats,
    }));
  };

  const updateIncomeCategory = (categoryId: string, isSelected: boolean) => {
    setState(prev => ({
      ...prev,
      incomeCategories: prev.incomeCategories.map(cat =>
        cat.id === categoryId ? { ...cat, isSelected } : cat
      ),
    }));
  };

  const updateExpenseCategory = (categoryId: string, isSelected: boolean) => {
    setState(prev => ({
      ...prev,
      expenseCategories: prev.expenseCategories.map(cat =>
        cat.id === categoryId ? { ...cat, isSelected } : cat
      ),
    }));
  };

  const addCustomIncomeCategory = (name: string, farmType: FarmType) => {
    const newCategory: IncomeCategory = {
      id: `custom_${Date.now()}`,
      name,
      defaultUnit: 'kg',
      isSelected: true,
      farmType,
    };

    setState(prev => ({
      ...prev,
      incomeCategories: [...prev.incomeCategories, newCategory],
    }));
  };

  const addCustomExpenseCategory = (name: string, farmType: FarmType) => {
    const newCategory: ExpenseCategory = {
      id: `custom_${Date.now()}`,
      name,
      isSelected: true,
      farmType,
    };

    setState(prev => ({
      ...prev,
      expenseCategories: [...prev.expenseCategories, newCategory],
    }));
  };

  const nextStep = () => {
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 3),
    }));
  };

  const prevStep = () => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  };

  const resetSetup = () => {
    setState({
      currentStep: 1,
      selectedFarmTypes: [],
      incomeCategories: [],
      expenseCategories: [],
      isCompleted: false,
    });
  };

  const completeSetup = () => {
    setState(prev => ({
      ...prev,
      isCompleted: true,
    }));
  };

  return (
    <FarmContext.Provider
      value={{
        state,
        selectFarmTypes,
        updateIncomeCategory,
        updateExpenseCategory,
        addCustomIncomeCategory,
        addCustomExpenseCategory,
        nextStep,
        prevStep,
        resetSetup,
        completeSetup,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};