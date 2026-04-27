import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, FONTS } from '../../utils/constants';
import Button from '../../components/common/Button';
import { MaterialIcons } from '@expo/vector-icons';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (rangeType: string, startDate?: Date, endDate?: Date) => void;
  currentRange: string;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  currentRange,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedRange, setSelectedRange] = useState(currentRange);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [customStart, setCustomStart] = useState(new Date());
  const [customEnd, setCustomEnd] = useState(new Date());

  const rangeOptions = [
    { id: 'today', label: 'Today', icon: 'today' },
    { id: 'week', label: 'This Week', icon: 'date-range' },
    { id: 'month', label: 'This Month', icon: 'calendar-month' },
    { id: '3months', label: 'Last 3 Months', icon: 'history' },
    { id: 'custom', label: 'Custom Range', icon: 'edit-calendar' },
  ];

  const handleApply = () => {
    if (selectedRange === 'custom') {
      onApply(selectedRange, customStart, customEnd);
    } else {
      onApply(selectedRange);
    }
    onClose();
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
            <View style={[styles.content, { paddingBottom: Math.max(insets.bottom, 20) }]}>
              <View style={styles.header}>
                <Text style={styles.title}>Filter</Text>
                <TouchableOpacity onPress={onClose}>
                  <MaterialIcons name="close" size={24} color={COLORS.text.secondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.optionsContainer}>
                {rangeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.option,
                      selectedRange === option.id && styles.optionSelected,
                    ]}
                    onPress={() => setSelectedRange(option.id)}
                  >
                    <MaterialIcons
                      name={option.icon as any}
                      size={20}
                      color={selectedRange === option.id ? COLORS.primary : COLORS.text.secondary}
                    />
                    <Text style={[
                      styles.optionLabel,
                      selectedRange === option.id && styles.optionLabelSelected,
                    ]}>
                      {option.label}
                    </Text>
                    {selectedRange === option.id && (
                      <MaterialIcons name="check" size={20} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {selectedRange === 'custom' && (
                <View style={styles.customRangeContainer}>
                  <Text style={styles.customRangeTitle}>Custom Range</Text>
                  
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowStartPicker(true)}
                  >
                    <Text style={styles.dateButtonLabel}>Start Date</Text>
                    <Text style={styles.dateButtonValue}>
                      {customStart.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowEndPicker(true)}
                  >
                    <Text style={styles.dateButtonLabel}>End Date</Text>
                    <Text style={styles.dateButtonValue}>
                      {customEnd.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {showStartPicker && (
                <DateTimePicker
                  value={customStart}
                  mode="date"
                  onChange={(event, selectedDate) => {
                    setShowStartPicker(false);
                    if (selectedDate) {
                      setCustomStart(selectedDate);
                    }
                  }}
                />
              )}

              {showEndPicker && (
                <DateTimePicker
                  value={customEnd}
                  mode="date"
                  onChange={(event, selectedDate) => {
                    setShowEndPicker(false);
                    if (selectedDate) {
                      setCustomEnd(selectedDate);
                    }
                  }}
                />
              )}

              <View style={styles.footer}>
                <Button
                  title="Cancel"
                  onPress={onClose}
                  variant="outline"
                  style={styles.footerButton}
                />
                <Button
                  title="Apply"
                  onPress={handleApply}
                  style={styles.footerButton}
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
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.large,
    color: COLORS.text.primary,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionSelected: {
    backgroundColor: COLORS.primary + '10',
  },
  optionLabel: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.primary,
    marginLeft: 12,
  },
  optionLabelSelected: {
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  customRangeContainer: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  customRangeTitle: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateButtonLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.secondary,
  },
  dateButtonValue: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default FilterModal;