import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MainTabParamList, DashboardStackParamList } from '../types';
import { COLORS, FONTS } from '../utils/constants';
import { MaterialIcons } from '@expo/vector-icons';

// Import screens
import DashboardScreen from '../screens/main/DashboardScreen';
import ReportScreen from '../screens/main/ReportScreen';
import HistoryScreen from '../screens/main/HistoryScreen'; // Changed from ListScreen
import ProfileScreen from '../screens/main/ProfileScreen';
import AddIncomeScreen from '../screens/main/AddIncomeScreen';
import AddExpenseScreen from '../screens/main/AddExpenseScreen';
import SettingsScreen from '../screens/main/SettingsScreen';

// Create stack for dashboard-related screens
const DashboardStack = createStackNavigator<DashboardStackParamList>();

const DashboardStackNavigator = () => {
  return (
    <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
      <DashboardStack.Screen name="DashboardMain" component={DashboardScreen} />
      <DashboardStack.Screen name="AddIncome" component={AddIncomeScreen} />
      <DashboardStack.Screen name="AddExpense" component={AddExpenseScreen} />
      <DashboardStack.Screen name="Report" component={ReportScreen} />
      <DashboardStack.Screen name="Settings" component={SettingsScreen} />
    </DashboardStack.Navigator>
  );
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
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
          height: 60,
          paddingBottom: 8,
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
        name="List"
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
        component={ProfileScreen}
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