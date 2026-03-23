// User related types
export interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string; // optional — not required for phone-number auth
  farmName?: string;
  location?: string;
  profilePhotoUrl?: string;
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
  AddIncome: { transaction?: any };
  AddExpense: { transaction?: any };
  TransactionDetail: { transactionId: string; type: 'income' | 'expense' };
  Settings: undefined;
};

// Form data types
export interface LoginFormData {
  phoneNumber: string;
  password: string;
  rememberMe: boolean;
}

export interface SignUpFormData {
  fullName: string;
  phoneNumber: string;
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


// Transaction types
export interface BaseTransaction {
  id: string;
  userId: string;
  date: Date;
  categoryId: string;
  categoryName: string;
  amount: number;
  notes?: string | null;
  createdAt: Date;
}

export interface IncomeTransaction extends BaseTransaction {
  type: 'income';
  quantity: number;
  unit: string;
}

export interface ExpenseTransaction extends BaseTransaction {
  type: 'expense';
  receiptUrl?: string | null;
}

export type Transaction = IncomeTransaction | ExpenseTransaction;

// Dashboard summary
export interface CategoryBreakdown {
  categoryName: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface MonthlyData {
  month: string;
  year: number;
  income: number;
  expense: number;
  balance: number;
  incomeChange?: number;
  expenseChange?: number;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  periodStart: Date;
  periodEnd: Date;
  incomeCount?: number;
  expenseCount?: number;
  incomeBreakdown?: CategoryBreakdown[];
  expenseBreakdown?: CategoryBreakdown[];
  comparison?: {
    incomeChange: number; // percentage
    expenseChange: number; // percentage
    balanceChange: number; // percentage
  };
  monthlyComparison?: MonthlyData[];
}

// Filter types
export type DateRangeType = 'today' | 'week' | 'month' | '3months' | 'custom';

export interface DateRange {
  startDate: Date;
  endDate: Date;
  label: string;
}

export interface FilterOptions {
  range: DateRangeType;
  customStartDate?: Date;
  customEndDate?: Date;
  categoryId?: string;
  type?: 'income' | 'expense' | 'all';
}

// Quick action types
export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  route: string;
}

// Recent transaction display
export interface RecentTransactionDisplay {
  id: string;
  type: 'income' | 'expense';
  categoryName: string;
  amount: number;
  date: Date;
  quantity?: number;
  unit?: string;
  notes?: string | null;
}

// Navigation params for main tabs
export type MainTabParamList = {
  Home: undefined;
  ReportTab: undefined;
  History: undefined;
  Profile: undefined;
};

export type DashboardStackParamList = {
  DashboardMain: undefined;
  AddIncome: undefined;
  AddExpense: undefined;
  Report: { range?: DateRangeType };
  History: undefined;
  TransactionDetail: { transactionId: string; type: 'income' | 'expense' };
  Settings: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  EditFarmDetails: undefined;
};

// Constants
export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'income',
    title: 'Income',
    icon: '💰',
    color: '#4CAF50',
    route: 'AddIncome',
  },
  {
    id: 'expense',
    title: 'Expense',
    icon: '💸',
    color: '#F44336',
    route: 'AddExpense',
  },
  {
    id: 'report',
    title: 'Report',
    icon: '📊',
    color: '#2196F3',
    route: 'Report',
  },
  {
    id: 'history',
    title: 'History',
    icon: '📄',
    color: '#FF9800',
    route: 'History',
  },
];


// Form data types for transactions
export interface IncomeFormData {
  date: Date;
  categoryId: string;
  categoryName: string;
  quantity: string;
  unit: string;
  amount: string;
  notes: string;
}

export interface ExpenseFormData {
  date: Date;
  categoryId: string;
  categoryName: string;
  amount: string;
  notes: string;
  receipt?: {
    uri: string;
    fileName: string;
    fileSize: number;
  };
}

export interface FormErrors {
  [key: string]: string;
}

// Category types for picker
export interface PickerCategory {
  id: string;
  name: string;
  defaultUnit?: string;
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: FormErrors;
}

// Success modal props
export interface SuccessModalProps {
  visible: boolean;
  type: 'income' | 'expense';
  amount: number;
  categoryName: string;
  onClose: () => void;
  onViewHistory: () => void;
  onAddAnother: () => void;
}


// Transaction history types
export interface GroupedTransactions {
  title: string; // "Today", "Yesterday", "March 5, 2026"
  data: TransactionDisplay[];
}

export interface TransactionDisplay {
  id: string;
  type: 'income' | 'expense';
  categoryName: string;
  amount: number;
  date: Date;
  quantity?: number;
  unit?: string;
  notes?: string;
  receiptUrl?: string;
}

export interface TransactionFilter {
  type: 'all' | 'income' | 'expense';
  startDate?: Date;
  endDate?: Date;
  categoryId?: string;
  searchQuery: string;
}

export interface TransactionSort {
  field: 'date' | 'amount' | 'category';
  direction: 'asc' | 'desc';
}

// Transaction detail modal props
export interface TransactionDetailProps {
  visible: boolean;
  transaction: TransactionDisplay | null;
  onClose: () => void;
  onEdit: (transaction: TransactionDisplay) => void;
  onDelete: (transactionId: string, type: 'income' | 'expense') => void;
}

// Filter chip types
export interface FilterChip {
  id: string;
  label: string;
  icon: string;
  selected: boolean;
}

// Pagination
export interface PaginationState {
  page: number;
  limit: number;
  hasMore: boolean;
  total: number;
}
