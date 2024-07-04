import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SimpleLineIcons } from '@expo/vector-icons';
import { setStatusBarHidden } from 'expo-status-bar';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
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