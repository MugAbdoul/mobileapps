import { View, Text, StyleSheet, Image, ScrollView, ScrollViewProps } from "react-native";
import React from "react";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Feather, AntDesign, Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth, useUser } from '@clerk/clerk-expo';
import i18n from '@/i18n';
import { useTranslation } from "react-i18next";
import { useTheme } from '@/hooks/ThemeContext';

const CustomDrawerContent = (props: React.JSX.IntrinsicAttributes & ScrollViewProps & { children: React.ReactNode; } & React.RefAttributes<ScrollView>) => {
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const { theme } = useTheme();

  const isDarkMode = theme === 'dark';
  const backgroundColor = isDarkMode ? "#333" : "#fff";
  const textColor = isDarkMode ? "#fff" : "#000";

  const { t } = useTranslation();

  return (
    <DrawerContentScrollView {...props} style={{backgroundColor: backgroundColor}}>
      {isSignedIn ? (
        <View style={styles.userInfoWrapper}>
          <Image
            source={{ uri: user?.imageUrl }}
            width={80}
            height={80}
            style={styles.userImg}
          />
          <View style={styles.userDetailsWrapper}>
            <Text style={[styles.userName, { color: textColor }]}>{user?.fullName}</Text>
            <Text style={[styles.userEmail, { color: textColor }]}>{user?.emailAddresses[0].emailAddress}</Text>
          </View>
        </View>
      ) : null}

      {isSignedIn ? (
        <>
          <DrawerItem
            icon={({ color, size }) => (
              <AntDesign
                name="user"
                size={size}
                color={pathname === "/profile" ? "#fff" : textColor}
              />
            )}
            label={t('menus.profile')}
            labelStyle={[styles.navItemLabel, { color: pathname === "/profile" ? "#fff" : textColor }]}
            style={{ backgroundColor }}
            onPress={() => {
              router.push("/(drawer)/profile");
            }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Ionicons
                name="settings-outline"
                size={size}
                color={pathname === "/settings" ? "#fff" : textColor}
              />
            )}
            label={t('settings.language')}
            labelStyle={[styles.navItemLabel, { color: pathname === "/settings" ? "#fff" : textColor }]}
            style={{ backgroundColor }}
            onPress={() => {
              router.push("/settings");
            }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <AntDesign
                name="contacts"
                size={size}
                color={pathname === "/ContactList" ? "#fff" : textColor}
              />
            )}
            label={t('contactList.title')}
            labelStyle={[styles.navItemLabel, { color: pathname === "/ContactList" ? "#fff" : textColor }]}
            style={{ backgroundColor }}
            onPress={() => {
              router.push("/ContactList");
            }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Feather
                name="log-out"
                size={size}
                color={pathname === "/logout" ? "#fff" : textColor}
              />
            )}
            label={t('menus.logout')}
            labelStyle={[styles.navItemLabel, { color: pathname === "/logout" ? "#fff" : textColor }]}
            style={{ backgroundColor }}
            onPress={() => {
              signOut();
            }}
          />
        </>
      ) : (
        <>
          <DrawerItem
            icon={({ color, size }) => (
              <Ionicons
                name="settings-outline"
                size={size}
                color={pathname === "/settings" ? "#fff" : textColor}
              />
            )}
            label={t('settings.language')}
            labelStyle={[styles.navItemLabel, { color: pathname === "/settings" ? "#fff" : textColor }]}
            style={{ backgroundColor }}
            onPress={() => {
              router.push("/settings");
            }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <AntDesign
                name="contacts"
                size={size}
                color={pathname === "/ContactList" ? "#fff" : textColor}
              />
            )}
            label={t('contactList.title')}
            labelStyle={[styles.navItemLabel, { color: pathname === "/ContactList" ? "#fff" : textColor }]}
            style={{ backgroundColor }}
            onPress={() => {
              router.push("/ContactList");
            }}
          />
        </>
      )}
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  return (
    <Drawer drawerContent={(props) => <CustomDrawerContent children={undefined} {...props} />} screenOptions={{headerShown: false}}>
      {/* Define your Drawer screens here */}
    </Drawer>
  );
}

const styles = StyleSheet.create({
  navItemLabel: {
    marginLeft: -20,
    fontSize: 18,
  },
  userInfoWrapper: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  userImg: {
    borderRadius: 40,
  },
  userDetailsWrapper: {
    marginTop: 25,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  userEmail: {
    fontSize: 16,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  }
});
