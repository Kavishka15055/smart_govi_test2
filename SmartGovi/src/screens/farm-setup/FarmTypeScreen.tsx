import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS, FONTS } from '../../utils/constants';
import { FarmSetupStackParamList, FARM_TYPE_OPTIONS, FarmType } from '../../types';
import { useFarmSetup } from '../../context/FarmContext';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import ProgressIndicator from '../../components/common/ProgressIndicator';

type FarmTypeScreenNavigationProp = StackNavigationProp<FarmSetupStackParamList, 'FarmType'>;

const FarmTypeScreen: React.FC = () => {
  const navigation = useNavigation<FarmTypeScreenNavigationProp>();
  const { state, selectFarmTypes, nextStep } = useFarmSetup();
  
  const [selectedTypes, setSelectedTypes] = useState<FarmType[]>(state.selectedFarmTypes);

  const toggleFarmType = (type: FarmType) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleNext = () => {
    if (selectedTypes.length > 0) {
      selectFarmTypes(selectedTypes);
      nextStep();
      navigation.navigate('IncomeSources', { farmType: selectedTypes[0] });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Farm Setup" showBack />
      
      <ProgressIndicator
        currentStep={1}
        totalSteps={3}
        labels={['Farm Type', 'Income', 'Expenses']}
      />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>What do you farm?</Text>
          <Text style={styles.subtitle}>Select all that apply</Text>

          <View style={styles.farmTypesGrid}>
            {FARM_TYPE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.farmTypeCard,
                  selectedTypes.includes(option.id) && styles.farmTypeCardSelected,
                ]}
                onPress={() => toggleFarmType(option.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.farmTypeEmoji}>{option.emoji}</Text>
                <Text style={styles.farmTypeLabel}>{option.label}</Text>
                {selectedTypes.includes(option.id) && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Button
          title="Next →"
          onPress={handleNext}
          size="large"
          disabled={selectedTypes.length === 0}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xxlarge,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  farmTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  farmTypeCard: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  farmTypeCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  farmTypeEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  farmTypeLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.medium,
    color: COLORS.text.primary,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
});

export default FarmTypeScreen;