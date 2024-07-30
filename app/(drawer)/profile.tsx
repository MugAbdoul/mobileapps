import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, TextInput, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import * as ImagePicker from 'expo-image-picker';
import { defaultStyles } from '@/constants/Styles';
import { useColorScheme } from '@/hooks/useColorScheme'; 
import { useTheme } from '@/hooks/ThemeContext';


export default function ProfilePage() {
  const { user } = useUser();
  const [fullName, setFullName] = useState<any>(user?.fullName);
  const [firstName, setFirstName] = useState<any>(user?.firstName);
  const [lastName, setLastName] = useState<any>(user?.lastName);
  const [imageUri, setImageUri] = useState<any>(user?.imageUrl);
  const [saving, setSaving] = useState(false);

  const colorScheme = useColorScheme();

  const { theme, toggleTheme } = useTheme();


  const isDarkMode = theme === 'dark';
  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  useEffect(() => {
    setFullName(user?.fullName);
    setFirstName(user?.firstName);
    setLastName(user?.lastName);
    setImageUri(user?.imageUrl);
  }, [user]);

  const handleSaveName = async () => {
    try {
      setSaving(true);
      await user?.update({ firstName, lastName });
      await user?.reload();
    } catch (error) {
      console.error('Failed to update name:', error);
      Alert.alert('Error', 'Failed to update name');
    } finally {
      setSaving(false);
    }
  };

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Permission to access media library is needed!');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 0.1,
        base64: true,
      });
  
      if (!result.canceled && result.assets[0].base64) {
        const base64 = result.assets[0].base64;
        const mimeType = result.assets[0].mimeType;
  
        const image = `data:${mimeType};base64,${base64}`;
  
        await user?.setProfileImage({
          file: image,
        });
        setImageUri(result.assets[0].uri);
      }
    } catch (err: any) {
      alert(err.errors[0].message);
    }
  };

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Text style={styles.title}>Profile Page</Text>

      <Image
        source={{ uri: imageUri }}
        style={styles.profileImage}
      />

      <Button title="Change Profile Picture" onPress={handleImagePicker} />

      <View style={styles.nameContainer}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <Button title="Save" onPress={handleSaveName} disabled={saving} />
      </View>

      <Button
        title="Go Home"
        onPress={() => router.push('/')}
        // style={styles.goHomeButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  nameContainer: {
    marginBottom: 20,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  goHomeButton: {
    marginTop: 20,
  },
});

const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  inputField: {
    ...defaultStyles.inputField,
    borderColor: '#ccc',
    color: '#000',
  },
  btn: {
    ...defaultStyles.btn,
    backgroundColor: '#000',
  },
  btnText: {
    ...defaultStyles.btnText,
    color: '#fff',
  },
  seperator: {
    color: '#999',
  },
  btnOutline: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  btnOutlineText: {
    color: '#000',
  },
  btnIcon: {
    color: '#000',
  },
  text: {
    color: '#000',
  },
});

const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
  inputField: {
    ...defaultStyles.inputField,
    borderColor: '#555',
    color: '#fff',
  },
  btn: {
    ...defaultStyles.btn,
    backgroundColor: '#fff',
  },
  btnText: {
    ...defaultStyles.btnText,
    color: '#000',
  },
  seperator: {
    color: '#ccc',
  },
  btnOutline: {
    backgroundColor: '#000',
    borderColor: '#555',
  },
  btnOutlineText: {
    color: '#fff',
  },
  btnIcon: {
    color: '#fff',
  },
  text: {
    color: '#fff',
  },
});
