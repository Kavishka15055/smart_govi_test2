import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS } from '../../utils/constants';
import { MaterialIcons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
}) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="search" size={20} color={COLORS.text.secondary} />
      
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search transactions..."
        placeholderTextColor={COLORS.text.disabled}
      />
      
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear}>
          <MaterialIcons name="clear" size={20} color={COLORS.text.secondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.primary,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
});

export default SearchBar;