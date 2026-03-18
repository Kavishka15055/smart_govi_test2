// User related types
export interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  farmName?: string;
  location?: string;
  preferredLanguage: 'en' | 'si';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Navigation params
export type AuthStackParamList = {
  Splash: undefined;
  Language: undefined;
  Login: undefined;
  SignUp: undefined;
  FarmSetup: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  FarmSetup: undefined;
};

// Form data types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignUpFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Language type
export type Language = 'en' | 'si';



// Farm related types
export interface Farm {
  id: string;
  userId: string;
  types: FarmType[];
  incomeCategories: IncomeCategory[];
  expenseCategories: ExpenseCategory[];
  createdAt: Date;
  updatedAt: Date;
}

export type FarmType = 
  | 'mushrooms'
  | 'vegetables'
  | 'paddy'
  | 'fruits'
  | 'poultry'
  | 'other';

export interface FarmTypeOption {
  id: FarmType;
  label: string;
  icon: string;
  emoji: string;
}

export interface IncomeCategory {
  id: string;
  name: string;
  defaultUnit: string;
  isSelected: boolean;
  farmType: FarmType;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  isSelected: boolean;
  farmType: FarmType;
}

export interface FarmSetupState {
  currentStep: number;
  selectedFarmTypes: FarmType[];
  incomeCategories: IncomeCategory[];
  expenseCategories: ExpenseCategory[];
  isCompleted: boolean;
}

// Navigation params for farm setup
export type FarmSetupStackParamList = {
  FarmType: undefined;
  IncomeSources: { farmType: FarmType };
  ExpenseCategories: undefined;
};

// Default categories data
export const DEFAULT_INCOME_CATEGORIES: Record<FarmType, IncomeCategory[]> = {
  mushrooms: [
    { id: 'oyster', name: 'Oyster Mushroom', defaultUnit: 'kg', isSelected: true, farmType: 'mushrooms' },
    { id: 'milky', name: 'Milky Mushroom', defaultUnit: 'kg', isSelected: false, farmType: 'mushrooms' },
    { id: 'king', name: 'King Oyster', defaultUnit: 'kg', isSelected: false, farmType: 'mushrooms' },
  ],
  vegetables: [
    { id: 'tomatoes', name: 'Tomatoes', defaultUnit: 'kg', isSelected: true, farmType: 'vegetables' },
    { id: 'chillies', name: 'Chillies', defaultUnit: 'kg', isSelected: true, farmType: 'vegetables' },
    { id: 'brinjal', name: 'Brinjal', defaultUnit: 'kg', isSelected: true, farmType: 'vegetables' },
  ],
  paddy: [
    { id: 'paddy_rice', name: 'Paddy/Rice', defaultUnit: 'kg', isSelected: true, farmType: 'paddy' },
  ],
  fruits: [
    { id: 'banana', name: 'Banana', defaultUnit: 'dozen', isSelected: true, farmType: 'fruits' },
    { id: 'papaya', name: 'Papaya', defaultUnit: 'kg', isSelected: true, farmType: 'fruits' },
  ],
  poultry: [
    { id: 'eggs', name: 'Eggs', defaultUnit: 'dozen', isSelected: true, farmType: 'poultry' },
    { id: 'broiler', name: 'Broiler Chicken', defaultUnit: 'kg', isSelected: true, farmType: 'poultry' },
  ],
  other: [
    { id: 'other_income', name: 'Other Income', defaultUnit: 'kg', isSelected: true, farmType: 'other' },
  ],
};

export const DEFAULT_EXPENSE_CATEGORIES: Record<FarmType, ExpenseCategory[]> = {
  mushrooms: [
    { id: 'spawn', name: 'Spawn', isSelected: true, farmType: 'mushrooms' },
    { id: 'substrate', name: 'Substrate', isSelected: true, farmType: 'mushrooms' },
    { id: 'labor', name: 'Labor', isSelected: true, farmType: 'mushrooms' },
    { id: 'transport', name: 'Transport', isSelected: true, farmType: 'mushrooms' },
    { id: 'packaging', name: 'Packaging', isSelected: true, farmType: 'mushrooms' },
  ],
  vegetables: [
    { id: 'seeds', name: 'Seeds', isSelected: true, farmType: 'vegetables' },
    { id: 'fertilizer', name: 'Fertilizer', isSelected: true, farmType: 'vegetables' },
    { id: 'pesticides', name: 'Pesticides', isSelected: true, farmType: 'vegetables' },
    { id: 'labor', name: 'Labor', isSelected: true, farmType: 'vegetables' },
    { id: 'transport', name: 'Transport', isSelected: true, farmType: 'vegetables' },
  ],
  paddy: [
    { id: 'seeds', name: 'Seeds', isSelected: true, farmType: 'paddy' },
    { id: 'fertilizer', name: 'Fertilizer', isSelected: true, farmType: 'paddy' },
    { id: 'water', name: 'Water/Irrigation', isSelected: true, farmType: 'paddy' },
    { id: 'labor', name: 'Labor', isSelected: true, farmType: 'paddy' },
  ],
  fruits: [
    { id: 'saplings', name: 'Saplings', isSelected: true, farmType: 'fruits' },
    { id: 'fertilizer', name: 'Fertilizer', isSelected: true, farmType: 'fruits' },
    { id: 'pesticides', name: 'Pesticides', isSelected: true, farmType: 'fruits' },
    { id: 'labor', name: 'Labor', isSelected: true, farmType: 'fruits' },
  ],
  poultry: [
    { id: 'chicks', name: 'Chicks', isSelected: true, farmType: 'poultry' },
    { id: 'feed', name: 'Feed', isSelected: true, farmType: 'poultry' },
    { id: 'medicine', name: 'Medicine', isSelected: true, farmType: 'poultry' },
    { id: 'labor', name: 'Labor', isSelected: true, farmType: 'poultry' },
  ],
  other: [
    { id: 'other_expense', name: 'Other Expense', isSelected: true, farmType: 'other' },
  ],
};

export const FARM_TYPE_OPTIONS: FarmTypeOption[] = [
  { id: 'mushrooms', label: 'Mushrooms', icon: '🍄', emoji: '🍄' },
  { id: 'vegetables', label: 'Vegetables', icon: '🥬', emoji: '🍆' },
  { id: 'paddy', label: 'Paddy', icon: '🌾', emoji: '🍌' },
  { id: 'fruits', label: 'Fruits', icon: '🍎', emoji: '🍊' },
  { id: 'poultry', label: 'Poultry', icon: '🐔', emoji: '🍐' },
  { id: 'other', label: 'Other', icon: '🌱', emoji: '🍏' },
];
