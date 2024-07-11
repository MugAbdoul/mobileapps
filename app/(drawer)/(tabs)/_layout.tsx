import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SimpleLineIcons } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        headerLeft: () => <DrawerToggleButton tintColor={colorScheme == 'dark'? 'white' : '#000'} />
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused, size }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="SignIn"
        options={{
          title: 'SignIn',
          tabBarIcon: ({ color, size }) => (
            <SimpleLineIcons name='login' color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="SignUp"
        options={{
          title: 'SignUp',
          tabBarIcon: ({ color, focused, size }) => (
            <TabBarIcon name={focused ? 'create' : 'create-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Calculator"
        options={{
          title: 'Calculator',
          tabBarIcon: ({ color, focused, size }) => (
            <TabBarIcon name={focused ? 'calculator':'calculator-outline'} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}