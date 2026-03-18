import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../utils/constants';

interface CategoryChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
  onAddToList?: () => void;
  showAddButton?: boolean;
}

const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  selected,
  onToggle,
  onAddToList,
  showAddButton = false,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.chip,
          selected && styles.chipSelected,
        ]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.chipText,
          selected && styles.chipTextSelected,
        ]}>
          {selected ? '✓ ' : '○ '}
          {label}
        </Text>
      </TouchableOpacity>
      
      {showAddButton && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={onAddToList}
        >
          <MaterialIcons name="add-circle-outline" size={20} color={COLORS.primary} />
          <Text style={styles.addButtonText}>Add to list</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  chip: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipSelected: {
    backgroundColor: COLORS.primary + '10',
    borderColor: COLORS.primary,
  },
  chipText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.primary,
  },
  chipTextSelected: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addButtonText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.primary,
    marginLeft: 4,
  },
});

export default CategoryChip;