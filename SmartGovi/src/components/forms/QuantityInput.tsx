import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS } from '../../utils/constants';

interface QuantityInputProps {
  quantity: string;
  weight: string;
  unit: string;
  availableUnits?: string[];
  onQuantityChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onUnitChange: (unit: string) => void;
  quantityError?: string;
  weightError?: string;
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  quantity,
  weight,
  unit,
  availableUnits = ['kg', 'g'],
  onQuantityChange,
  onWeightChange,
  onUnitChange,
  quantityError,
  weightError,
}) => {
  const [showUnitPicker, setShowUnitPicker] = React.useState(false);

  const hasError = !!quantityError || !!weightError;

  return (
    <View style={styles.container}>
      {/* Quantity Row */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Quantity</Text>
        <View style={[styles.inputContainer, quantityError && styles.inputError]}>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={onQuantityChange}
            placeholder="0"
            keyboardType="numeric"
            placeholderTextColor={COLORS.text.disabled}
          />
        </View>
        {quantityError && <Text style={styles.errorText}>{quantityError}</Text>}
      </View>

      {/* Weight Row */}
      <View style={styles.weightRow}>
        <View style={styles.weightField}>
          <Text style={styles.label}>Weight per Unit</Text>
          <View style={[styles.inputContainer, weightError && styles.inputError]}>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={onWeightChange}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor={COLORS.text.disabled}
            />
          </View>
          {weightError && <Text style={styles.errorText}>{weightError}</Text>}
        </View>

        <View style={styles.unitField}>
          <Text style={styles.label}>Unit</Text>
          <TouchableOpacity
            style={[styles.unitContainer]}
            onPress={() => setShowUnitPicker(!showUnitPicker)}
          >
            <Text style={styles.unitText}>{unit}</Text>
            <Text style={styles.unitArrow}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showUnitPicker && (
        <View style={styles.unitPicker}>
          {availableUnits.map((u) => (
            <TouchableOpacity
              key={u}
              style={[
                styles.unitOption,
                unit === u && styles.unitOptionSelected,
              ]}
              onPress={() => {
                onUnitChange(u);
                setShowUnitPicker(false);
              }}
            >
              <Text style={[
                styles.unitOptionText,
                unit === u && styles.unitOptionTextSelected,
              ]}>
                {u}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.secondary,
    marginBottom: 6,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.primary,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  weightField: {
    flex: 2,
    marginRight: 8,
  },
  unitField: {
    flex: 1,
  },
  unitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  unitText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.primary,
  },
  unitArrow: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.secondary,
  },
  errorText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.error,
    marginTop: 4,
  },
  unitPicker: {
    position: 'absolute',
    top: '100%',
    right: 0,
    width: 120,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 4,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  unitOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  unitOptionSelected: {
    backgroundColor: COLORS.primary + '10',
  },
  unitOptionText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.primary,
  },
  unitOptionTextSelected: {
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
});

export default QuantityInput;