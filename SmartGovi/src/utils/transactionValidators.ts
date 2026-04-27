import { IncomeFormData, ExpenseFormData, ValidationResult } from '../types';

export const validateIncomeForm = (data: IncomeFormData): ValidationResult => {
  const errors: { [key: string]: string } = {};

  // Validate category
  if (!data.categoryId) {
    errors.category = 'Please select a category';
  }

  // Validate quantity
  if (!data.quantity) {
    errors.quantity = 'Quantity is required';
  } else {
    const quantityNum = parseFloat(data.quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
    }
  }

  // Validate weight
  if (!data.weight) {
    errors.weight = 'Weight is required';
  } else {
    const weightNum = parseFloat(data.weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      errors.weight = 'Weight must be greater than 0';
    }
  }

  // Validate amount
  if (!data.amount) {
    errors.amount = 'Amount is required';
  } else {
    const amountNum = parseFloat(data.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateExpenseForm = (data: ExpenseFormData): ValidationResult => {
  const errors: { [key: string]: string } = {};

  // Validate category
  if (!data.categoryId) {
    errors.category = 'Please select a category';
  }

  // Validate amount
  if (!data.amount) {
    errors.amount = 'Amount is required';
  } else {
    const amountNum = parseFloat(data.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const sanitizeAmount = (value: string): string => {
  // Remove any non-numeric characters except decimal point
  const sanitized = value.replace(/[^0-9.]/g, '');
  
  // Ensure only one decimal point
  const parts = sanitized.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }
  
  return sanitized;
};

export const sanitizeQuantity = (value: string): string => {
  // Remove any non-numeric characters except decimal point
  const sanitized = value.replace(/[^0-9.]/g, '');
  
  // Ensure only one decimal point
  const parts = sanitized.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }
  
  return sanitized;
};

export const formatAmountForDisplay = (amount: number): string => {
  return amount.toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};