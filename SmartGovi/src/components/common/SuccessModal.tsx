import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { COLORS, FONTS } from '../../utils/constants';
import Button from './Button';
import { MaterialIcons } from '@expo/vector-icons';

interface SuccessModalProps {
  visible: boolean;
  type: 'income' | 'expense';
  amount: number;
  categoryName: string;
  onClose: () => void;
  onViewHistory: () => void;
  onAddAnother: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  type,
  amount,
  categoryName,
  onClose,
  onViewHistory,
  onAddAnother,
}) => {
  const formatCurrency = (amount: number) => {
    return `Rs ${amount.toLocaleString('en-LK')}`;
  };

  const isIncome = type === 'income';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.content}>
              <View style={styles.iconContainer}>
                <View style={[styles.iconCircle, isIncome ? styles.incomeCircle : styles.expenseCircle]}>
                  <MaterialIcons 
                    name={isIncome ? 'trending-up' : 'trending-down'} 
                    size={40} 
                    color={COLORS.white} 
                  />
                </View>
              </View>

              <Text style={styles.title}>Success!</Text>
              <Text style={styles.message}>
                {isIncome ? 'Income' : 'Expense'} added successfully
              </Text>

              <View style={styles.detailsContainer}>
                <Text style={styles.categoryName}>{categoryName}</Text>
                <Text style={[styles.amount, isIncome ? styles.incomeAmount : styles.expenseAmount]}>
                  {isIncome ? '+' : '-'}{formatCurrency(amount)}
                </Text>
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  title="View History"
                  onPress={onViewHistory}
                  variant="outline"
                  style={styles.button}
                />
                <Button
                  title={`Add Another ${isIncome ? 'Income' : 'Expense'}`}
                  onPress={onAddAnother}
                  style={styles.button}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incomeCircle: {
    backgroundColor: COLORS.success,
  },
  expenseCircle: {
    backgroundColor: COLORS.error,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xxlarge,
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  message: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.secondary,
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryName: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.large,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  amount: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xxxlarge,
  },
  incomeAmount: {
    color: COLORS.success,
  },
  expenseAmount: {
    color: COLORS.error,
  },
  buttonContainer: {
    width: '100%',
    gap: 8,
  },
  button: {
    width: '100%',
  },
});

export default SuccessModal;