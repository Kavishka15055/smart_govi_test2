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
  unit: string;
  availableUnits?: string[];
  onQuantityChange: (value: string) => void;
  onUnitChange: (unit: string) => void;
  error?: string;
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  quantity,
  unit,
  availableUnits = ['kg', 'g', 'dozen', 'piece', 'liter'],
  onQuantityChange,
  onUnitChange,
  error,
}) => {
  const [showUnitPicker, setShowUnitPicker] = React.useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Quantity</Text>
      
      <View style={styles.row}>
        <View style={[styles.quantityContainer, error && styles.inputError]}>
          <TextInput
            style={styles.quantityInput}
            value={quantity}
            onChangeText={onQuantityChange}
            placeholder="0"
            keyboardType="numeric"
            placeholderTextColor={COLORS.text.disabled}
          />
        </View>

        <TouchableOpacity
          style={[styles.unitContainer, error && styles.inputError]}
          onPress={() => setShowUnitPicker(true)}
        >
          <Text style={styles.unitText}>{unit}</Text>
          <Text style={styles.unitArrow}>▼</Text>
        </TouchableOpacity>
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}

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
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.secondary,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityContainer: {
    flex: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    marginRight: 8,
  },
  unitContainer: {
    flex: 1,
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
  inputError: {
    borderColor: COLORS.error,
  },
  quantityInput: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.primary,
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