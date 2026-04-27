import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { COLORS, FONTS } from '../../utils/constants';
import { TransactionDetailProps } from '../../types';
import {
  formatCurrency,
  formatDateForDisplay,
  getTransactionIcon,
  getTransactionColor,
} from '../../utils/transactionHelpers';
import Button from '../common/Button';
import { MaterialIcons } from '@expo/vector-icons';

const TransactionDetailModal: React.FC<TransactionDetailProps> = ({
  visible,
  transaction,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!transaction) return null;

  const isIncome = transaction.type === 'income';
  const icon = getTransactionIcon(transaction.type);
  const color = getTransactionColor(transaction.type);

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete(transaction.id, transaction.type);
            onClose();
          },
        },
      ]
    );
  };

  const handleViewReceipt = () => {
    if (transaction.receiptUrl) {
      Linking.openURL(transaction.receiptUrl);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity onPress={onClose}>
                  <MaterialIcons name="close" size={24} color={COLORS.text.secondary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Transaction Details</Text>
                <TouchableOpacity onPress={() => onEdit(transaction)}>
                  <MaterialIcons name="edit" size={24} color={COLORS.primary} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Icon and Type */}
                <View style={styles.iconSection}>
                  <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
                    <Text style={styles.iconEmoji}>{icon}</Text>
                  </View>
                  <Text style={[styles.typeText, { color }]}>
                    {isIncome ? 'INCOME' : 'EXPENSE'}
                  </Text>
                </View>

                {/* Amount */}
                <View style={styles.amountSection}>
                  <Text style={[styles.amount, { color }]}>
                    {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </Text>
                </View>

                {/* Details Card */}
                <View style={styles.detailsCard}>
                  <DetailRow
                    icon="category"
                    label="Category"
                    value={transaction.categoryName}
                  />
                  
                  <DetailRow
                    icon="calendar-today"
                    label="Date & Time"
                    value={formatDateForDisplay(transaction.date)}
                  />

                  {isIncome && !!transaction.quantity && (
                    <DetailRow
                      icon="straighten"
                      label="Quantity"
                      value={
                        transaction.weight
                          ? `${transaction.quantity} × ${transaction.weight}${transaction.unit}`
                          : `${transaction.quantity} ${transaction.unit}`
                      }
                    />
                  )}

                  {transaction.notes ? (
                    <DetailRow
                      icon="notes"
                      label="Notes"
                      value={transaction.notes}
                      isMultiline
                    />
                  ) : null}

                  {!isIncome && !!transaction.receiptUrl && (
                    <TouchableOpacity
                      style={styles.receiptButton}
                      onPress={handleViewReceipt}
                    >
                      <MaterialIcons name="receipt" size={20} color={COLORS.primary} />
                      <Text style={styles.receiptButtonText}>View Receipt</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <Button
                    title="Edit"
                    onPress={() => onEdit(transaction)}
                    variant="outline"
                    style={styles.actionButton}
                  />
                  <Button
                    title="Delete"
                    onPress={handleDelete}
                    variant="outline"
                    textStyle={{ color: COLORS.error }}
                    style={[styles.actionButton, styles.deleteButton]}
                  />
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const DetailRow: React.FC<{
  icon: string;
  label: string;
  value: string;
  isMultiline?: boolean;
}> = ({ icon, label, value, isMultiline }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailLabel}>
      <MaterialIcons name={icon as any} size={20} color={COLORS.text.secondary} />
      <Text style={styles.detailLabelText}>{label}</Text>
    </View>
    <Text
      style={[styles.detailValue, isMultiline && styles.detailValueMultiline]}
      numberOfLines={isMultiline ? 3 : 1}
    >
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.large,
    color: COLORS.text.primary,
  },
  iconSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconEmoji: {
    fontSize: 40,
  },
  typeText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.medium,
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  amount: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xxxlarge,
  },
  detailsCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
  },
  detailRow: {
    marginBottom: 16,
  },
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailLabelText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.secondary,
    marginLeft: 8,
  },
  detailValue: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.primary,
    marginLeft: 28,
  },
  detailValueMultiline: {
    lineHeight: 20,
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  receiptButtonText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.medium,
    color: COLORS.primary,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  deleteButton: {
    borderColor: COLORS.error,
  },
});

export default TransactionDetailModal;