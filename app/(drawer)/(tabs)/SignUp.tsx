import * as React from "react";
import { TextInput, Button, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useAuth, useSignUp } from "@clerk/clerk-expo";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { defaultStyles } from '@/constants/Styles';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SignUpScreen() {
  useWarmUpBrowser();

  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();
  const colorScheme = useColorScheme();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const isDarkMode = colorScheme === 'dark';
  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  return (
    <View style={[styles.container, themeStyles.container]}>
      <SignedOut>
      {!pendingVerification && (
        <>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email..."
            placeholderTextColor={isDarkMode ? '#ccc' : '#999'}
            style={[defaultStyles.inputField, { marginBottom: 30 }, themeStyles.inputField]}
            onChangeText={(email) => setEmailAddress(email)}
          />
          <TextInput
            value={password}
            placeholder="Password..."
            secureTextEntry={true}
            placeholderTextColor={isDarkMode ? '#ccc' : '#999'}
            style={[defaultStyles.inputField, { marginBottom: 30 }, themeStyles.inputField]}
            onChangeText={(password) => setPassword(password)}
          />
          <TouchableOpacity style={[defaultStyles.btn, themeStyles.btn]} onPress={onSignUpPress}>
            <Text style={[defaultStyles.btnText, themeStyles.btnText]}>Continue</Text>
          </TouchableOpacity>
        </>
      )}
      {pendingVerification && (
        <>
          <Text style={{ marginBottom: 10, color: themeStyles.text.color }}>Verify code</Text>
          <TextInput
            value={code}
            placeholder="Code..."
            placeholderTextColor={isDarkMode ? '#ccc' : '#999'}
            style={[defaultStyles.inputField, { marginBottom: 30 }, themeStyles.inputField]}
            onChangeText={(code) => setCode(code)}
          />
          <Button title="Verify Email" onPress={onPressVerify} />
        </>
      )}
      </SignedOut>
      <SignedIn>
        <Text style={[{ fontSize: 20 }, themeStyles.text]}>{user?.emailAddresses[0].emailAddress} is loggedIn</Text>
        <TouchableOpacity style={[defaultStyles.btn, themeStyles.btn]} onPress={() => signOut()}>
          <Text style={[defaultStyles.btnText, themeStyles.btnText]}>Log Out</Text>
        </TouchableOpacity>
      </SignedIn>
      
    </View>
  );
}

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
