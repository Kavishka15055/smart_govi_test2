import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MainTabParamList, DashboardStackParamList, ProfileStackParamList } from '../types';
import { COLORS, FONTS } from '../utils/constants';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import screens
import DashboardScreen from '../screens/main/DashboardScreen';
import ReportScreen from '../screens/main/ReportScreen';
import HistoryScreen from '../screens/main/HistoryScreen'; // Changed from ListScreen
import ProfileScreen from '../screens/main/ProfileScreen';
import AddIncomeScreen from '../screens/main/AddIncomeScreen';
import AddExpenseScreen from '../screens/main/AddExpenseScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import EditProfileScreen from '../screens/main/EditProfileScreen';
import EditFarmDetailsScreen from '../screens/main/EditFarmDetailsScreen';
import TransactionDetailScreen from '../screens/main/TransactionDetailScreen';

// Create stack for dashboard-related screens
const DashboardStack = createStackNavigator<DashboardStackParamList>();

const DashboardStackNavigator = () => {
  return (
    <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
      <DashboardStack.Screen name="DashboardMain" component={DashboardScreen} />
    </DashboardStack.Navigator>
  );
};

const ProfileStack = createStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
      <ProfileStack.Screen name="EditFarmDetails" component={EditFarmDetailsScreen} />
    </ProfileStack.Navigator>
  );
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.text.secondary,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 60 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: FONTS.regular,
          fontSize: FONTS.sizes.small,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="ReportTab"
        component={ReportScreen}
        options={{
          tabBarLabel: 'Reports',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="bar-chart" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;