import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS } from '../../utils/constants';
import { MaterialIcons } from '@expo/vector-icons';

interface FilterChip {
  id: string;
  label: string;
  icon: string;
  selected: boolean;
}

interface FilterChipsProps {
  chips: FilterChip[];
  onChipPress: (id: string) => void;
  onSortPress?: () => void;
  sortIcon?: string;
}

const FilterChips: React.FC<FilterChipsProps> = ({
  chips,
  onChipPress,
  onSortPress,
  sortIcon = 'sort',
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {chips.map((chip) => (
          <TouchableOpacity
            key={chip.id}
            style={[
              styles.chip,
              chip.selected && styles.chipSelected,
            ]}
            onPress={() => onChipPress(chip.id)}
          >
            <MaterialIcons
              name={chip.icon as any}
              size={16}
              color={chip.selected ? COLORS.white : COLORS.text.secondary}
            />
            <Text style={[
              styles.chipText,
              chip.selected && styles.chipTextSelected,
            ]}>
              {chip.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {onSortPress && (
        <TouchableOpacity style={styles.sortButton} onPress={onSortPress}>
          <MaterialIcons name={sortIcon as any} size={20} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  scrollContent: {
    paddingRight: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
  },
  chipText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.small,
    color: COLORS.text.secondary,
    marginLeft: 4,
  },
  chipTextSelected: {
    color: COLORS.white,
  },
  sortButton: {
    padding: 8,
    marginLeft: 4,
  },
});

export default FilterChips;