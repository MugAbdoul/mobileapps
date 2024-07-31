import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { SimpleLineIcons } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/ThemeContext';

export default function TabLayout() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[theme ?? 'light'].tint,
        tabBarStyle: {
          backgroundColor: theme === 'dark' ? '#333' : '#fff',
          borderTopColor: theme === 'dark' ? '#333' : '#ccc',
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: theme === 'dark' ? '#333' : '#fff',
        },
        headerTintColor: theme === 'dark' ? 'white' : '#333',
        headerLeft: () => <DrawerToggleButton tintColor={theme === 'dark' ? 'white' : '#333'} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('menus.home'),
          tabBarIcon: ({ color, focused, size }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="SignIn"
        options={{
          title: t('menus.signin'),
          tabBarIcon: ({ color, size }) => (
            <SimpleLineIcons name="login" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="SignUp"
        options={{
          title: t('menus.signup'),
          tabBarIcon: ({ color, focused, size }) => (
            <TabBarIcon name={focused ? 'create' : 'create-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Calculator"
        options={{
          title: t('menus.calculator'),
          tabBarIcon: ({ color, focused, size }) => (
            <TabBarIcon name={focused ? 'calculator' : 'calculator-outline'} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
