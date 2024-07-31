import { View, Text } from 'react-native'
import React from 'react'
import { useTheme } from '@/hooks/ThemeContext';

const index = () => {
  const { theme } = useTheme();
  return (
    <View style={{backgroundColor: theme === 'light' ? 'white' : 'black', flex: 1}}>
      <Text>index</Text>
    </View>
  )
}

export default index  