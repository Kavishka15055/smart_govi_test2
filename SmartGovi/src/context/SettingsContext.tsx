import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Settings {
  showMonthlyComparison: boolean;
}

interface SettingsContextType {
  settings: Settings;
  toggleMonthlyComparison: () => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const DEFAULT_SETTINGS: Settings = {
  showMonthlyComparison: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    // Load settings from storage
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('app_settings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem('app_settings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const toggleMonthlyComparison = () => {
    const newSettings = {
      ...settings,
      showMonthlyComparison: !settings.showMonthlyComparison,
    };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, toggleMonthlyComparison, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
