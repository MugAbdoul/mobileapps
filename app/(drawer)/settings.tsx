import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Text, Switch, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import styled from 'styled-components/native';
import { useTheme } from '@/hooks/ThemeContext';

const themes = {
  light: {
    background: '#fff',
    text: '#000',
  },
  dark: {
    background: '#333',
    text: '#fff',
  },
};


const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const { theme, toggleTheme } = useTheme();
  
  useEffect(() => {
    const loadPreferences = async () => {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage);
        setLanguage(savedLanguage);
      }
    };

    loadPreferences();
  }, []);

  const changeLanguage = async (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    await AsyncStorage.setItem('language', lang);
  };

  const [getTheme, setTheme] = useState(theme === 'dark' ? themes['dark'] : themes['light']) as any;

  useEffect(()=>{
    setTheme(theme === 'dark' ? themes['dark'] : themes['light']);
  }, [theme])

  return (
      <View style={{flex: 1, backgroundColor: getTheme.background, paddingVertical: 50, paddingHorizontal: 30}}>
        <Text style={{ color: getTheme.text, marginTop: 0, marginBottom: 20, fontSize: 25, fontWeight: 'bold' }}>{t('settings.language')}</Text>
        <Button title="English" onPress={() => changeLanguage('en')} />
        <Button title="Français" onPress={() => changeLanguage('fr')} />
        <View style={styles.switchContainer}>
          <Text style={{ color: getTheme.text }}>{t('settings.darkMode')}</Text>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
          />
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default SettingsScreen;
