import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { farmService } from '../services/farmService';

// Import navigators
import AuthStack from './AuthStack';
import FarmSetupStack from './FarmSetupStack';
import MainTabNavigator from './MainTabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isCheckingSetup, setIsCheckingSetup] = useState(true);
  const [farmSetupComplete, setFarmSetupComplete] = useState(false);

  useEffect(() => {
    const checkFarmSetup = async () => {
      if (user) {
        try {
          const completed = await farmService.checkFarmSetupComplete(user.id);
          setFarmSetupComplete(completed);
        } catch (error) {
          console.error('Error checking farm setup:', error);
          setFarmSetupComplete(false);
        } finally {
          setIsCheckingSetup(false);
        }
      } else {
        setIsCheckingSetup(false);
      }
    };

    checkFarmSetup();
  }, [user]);

  if (isLoading || isCheckingSetup) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : !farmSetupComplete ? (
          <Stack.Screen name="FarmSetup" component={FarmSetupStack} />
        ) : (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;