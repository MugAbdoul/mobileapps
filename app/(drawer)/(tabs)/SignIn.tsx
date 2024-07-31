import { Colors } from '@/constants/Colors';
import { useOAuth, useSignIn } from '@clerk/clerk-expo';
import { useAuth } from '@clerk/clerk-expo';
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import Toast from 'react-native-toast-message';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';

import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';
import { defaultStyles } from '@/constants/Styles';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTheme } from '@/hooks/ThemeContext'; 

enum Strategy {
  Google = 'oauth_google',
  Apple = 'oauth_apple',
  Facebook = 'oauth_facebook',
}

const Page: React.FC = () => {
  useWarmUpBrowser();

  const router = useRouter();
  const { user } = useUser();
  const { theme } = useTheme();
  
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: 'oauth_apple' });
  const { startOAuthFlow: facebookAuth } = useOAuth({ strategy: 'oauth_facebook' });

  const { signIn, setActive, isLoaded } = useSignIn();
  const { signOut } = useAuth();
  const colorScheme = useColorScheme();

  const showToast = (type: 'success' | 'error', title: string, message: string) => {
    Toast.show({
      type: type,
      text1: title,
      text2: message,
    });
  };

  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Google]: googleAuth,
      [Strategy.Apple]: appleAuth,
      [Strategy.Facebook]: facebookAuth,
    }[strategy];

    try {
      const { createdSessionId, setActive } = await selectedAuth();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.back();
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  };

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        showToast('success', 'Success', 'Logged in successfully.');
        router.replace('/');
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
        showToast('error', 'Error', 'Failed to log in.');
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      showToast('error', 'Error', 'Failed to log in.');
    }
  }, [isLoaded, emailAddress, password]);

  const isDarkMode = theme === 'dark';
  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  return (
    <View style={[styles.container, themeStyles.container]}>
      <SignedOut>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Email..."
          placeholderTextColor={isDarkMode ? '#ccc' : '#999'}
          style={[defaultStyles.inputField, { marginBottom: 30 }, themeStyles.inputField]}
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
        <TextInput
          value={password}
          placeholder="Password..."
          placeholderTextColor={isDarkMode ? '#ccc' : '#999'}
          secureTextEntry={true}
          style={[defaultStyles.inputField, { marginBottom: 30 }, themeStyles.inputField]}
          onChangeText={(password) => setPassword(password)}
        />

        <TouchableOpacity style={[defaultStyles.btn, themeStyles.btn]} onPress={onSignInPress}>
          <Text style={[defaultStyles.btnText, themeStyles.btnText]}>Continue</Text>
        </TouchableOpacity>

        <View style={styles.seperatorView}>
          <View
            style={{
              flex: 1,
              borderBottomColor: isDarkMode ? '#ccc' : 'black',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <Text style={[styles.seperator, themeStyles.seperator]}>or</Text>
          <View
            style={{
              flex: 1,
              borderBottomColor: isDarkMode ? '#ccc' : 'black',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
        </View>

        <View style={{ gap: 20 }}>
          <TouchableOpacity style={[styles.btnOutline, themeStyles.btnOutline]} onPress={() => onSelectAuth(Strategy.Apple)}>
            <Ionicons name="logo-apple" size={24} style={[defaultStyles.btnIcon, themeStyles.btnIcon]} />
            <Text style={[styles.btnOutlineText, themeStyles.btnOutlineText]}>Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btnOutline, themeStyles.btnOutline]} onPress={() => onSelectAuth(Strategy.Google)}>
            <Ionicons name="logo-google" size={24} style={[defaultStyles.btnIcon, themeStyles.btnIcon]} />
            <Text style={[styles.btnOutlineText, themeStyles.btnOutlineText]}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btnOutline, themeStyles.btnOutline]} onPress={() => onSelectAuth(Strategy.Facebook)}>
            <Ionicons name="logo-facebook" size={24} style={[defaultStyles.btnIcon, themeStyles.btnIcon]} />
            <Text style={[styles.btnOutlineText, themeStyles.btnOutlineText]}>Continue with Facebook</Text>
          </TouchableOpacity>
        </View>
      </SignedOut>
      <SignedIn>
        <Text style={[{ fontSize: 20 }, themeStyles.text]}>{user?.emailAddresses[0].emailAddress} is logged in</Text>
        <TouchableOpacity style={[defaultStyles.btn, themeStyles.btn]} onPress={() => signOut()}>
          <Text style={[defaultStyles.btnText, themeStyles.btnText]}>Log Out</Text>
        </TouchableOpacity>
      </SignedIn>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 26,
  },
  seperatorView: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginVertical: 30,
  },
  seperator: {
    fontFamily: 'mon-sb',
    fontSize: 16,
  },
  btnOutline: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  btnOutlineText: {
    fontSize: 16,
    fontFamily: 'mon-sb',
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
