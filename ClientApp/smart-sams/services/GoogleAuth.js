import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeRedirectUri } from 'expo-auth-session';


// Ensure the redirect URI is set up correctly for web and native platforms
const redirectUri = makeRedirectUri({
    useProxy: true,
  });

WebBrowser.maybeCompleteAuthSession();

const webClientId = Constants.expoConfig.extra.webClientId;
const iosClientId = Constants.expoConfig.extra.iosClientId;
const androidClientId = Constants.expoConfig.extra.androidClientId;

export function useGoogleAuthentication() {
  const [userInfo, setUserInfo] = React.useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId,
    iosClientId,
    webClientId,
    redirectUri
  });

  // Load user if already signed in
  React.useEffect(() => {
    const loadStoredUser = async () => {
      const storedUser = await AsyncStorage.getItem('@user');
      if (storedUser) {
        setUserInfo(JSON.parse(storedUser));
      }
    };
    loadStoredUser();
  }, []);

  // Handle sign-in response
  const handleSignInWithGoogle = async () => {
    if (response?.type === 'success' && response?.params?.access_token) {
      try {
        const { access_token } = response.params;
        await AsyncStorage.setItem('google_auth_token', access_token);

        const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: { Authorization: `Bearer ${access_token}` },
        });

        const userInfoData = await userInfoResponse.json();
        await AsyncStorage.setItem('@user', JSON.stringify(userInfoData));
        setUserInfo(userInfoData);
        console.log
        return userInfoData;
      } catch (err) {
        console.error('Failed fetching user info:', err);
      }
    } else if (response?.type === 'error') {
      console.error('Google Sign-In Error:', response.params?.error);
    }
  };

    React.useEffect(() => {
        console.log('Google response:', response)
    handleSignInWithGoogle();
  }, [response]);

  return {
    userInfo,
    promptAsync,
    request
  };
}
