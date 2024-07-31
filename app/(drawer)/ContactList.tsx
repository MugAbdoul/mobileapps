import React, { useEffect, useState } from 'react';
import { View, Text, Alert, FlatList, useColorScheme } from 'react-native';
import * as Contacts from 'expo-contacts';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/ThemeContext';

// Define a type for the theme prop
interface ThemeProps {
  theme: 'light' | 'dark';
}

const Container = styled.View<ThemeProps>`
  flex: 1;
  background-color: ${({ theme }:any) => (theme === 'dark' ? '#333' : '#fff')};
  padding: 16px;
`;
const Title = styled.Text<ThemeProps>`
    font-size: 30px;
    color: ${({ theme }:any) => (theme === 'dark' ? '#000' : '#fff')};
    margin-bottom: 20px;
    margin-top: 30px;

`;

const ContactItem = styled.View<ThemeProps>`
  background-color: ${({ theme }:any) => (theme === 'dark' ? '#444' : '#f9f9f9')};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
`;

const ContactName = styled.Text<ThemeProps>`
  color: ${({ theme }:any) => (theme === 'dark' ? '#fff' : '#000')};
  font-size: 18px;
`;

const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<Contacts.PermissionStatus | null>(null);
  const colorScheme = useColorScheme(); // Detects if the system is in light or dark mode
  const { t } = useTranslation();
  const {theme} = useTheme();

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    setPermissionStatus(status);

    if (status === 'granted') {
      fetchContacts();
    } else {
      Alert.alert(
        t('contactList.permissionDenied'),
        t('contactList.permissionMessage'),
        [{ text: t('contactList.ok') }]
      );
    }
  };

  const fetchContacts = async () => {
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
      });

      if (data.length > 0) {
        setContacts(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container theme={theme as 'light' | 'dark'}>
        <Title style={{color: theme === 'dark' ? 'white' : 'black'}}>{t('contactList.title')}</Title>
      <FlatList
        data={contacts}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => (
          <ContactItem theme={theme as 'light' | 'dark'}>
            <ContactName theme={theme as 'light' | 'dark'}>{item.name}</ContactName>
          </ContactItem>
        )}
      />
    </Container>
  );
};

export default ContactList;
