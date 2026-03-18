import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Import navigators
import AuthStack from './AuthStack';
import FarmSetupStack from './FarmSetupStack';

// Placeholder for MainStack (will be created in next phase)
const MainStack = () => null;

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          // User is logged in - check if farm setup is complete
          // For now, we'll check a flag - you'll need to implement this
          // based on your user data
          <>
            <Stack.Screen name="FarmSetup" component={FarmSetupStack} />
            <Stack.Screen name="Main" component={MainStack} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;