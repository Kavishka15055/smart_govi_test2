import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { FarmSetupStackParamList } from '../types';
import { FarmProvider } from '../context/FarmContext';

// Import farm setup screens
import FarmTypeScreen from '../screens/farm-setup/FarmTypeScreen';
import IncomeSourcesScreen from '../screens/farm-setup/IncomeSourcesScreen';
import ExpenseCategoriesScreen from '../screens/farm-setup/ExpenseCategoriesScreen';

const Stack = createStackNavigator<FarmSetupStackParamList>();

const FarmSetupStack: React.FC = () => {
  return (
    <FarmProvider>
      <Stack.Navigator
        initialRouteName="FarmType"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#FFFFFF' },
        }}
      >
        <Stack.Screen name="FarmType" component={FarmTypeScreen} />
        <Stack.Screen name="IncomeSources" component={IncomeSourcesScreen} />
        <Stack.Screen name="ExpenseCategories" component={ExpenseCategoriesScreen} />
      </Stack.Navigator>
    </FarmProvider>
  );
};

export default FarmSetupStack;