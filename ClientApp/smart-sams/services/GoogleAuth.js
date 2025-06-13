import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useGoogleAuthentication() {
  const [userInfo, setUserInfo] = React.useState(null);

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

  // Trigger server-side Google OAuth
  const signInWithGoogle = async () => {
    try {
      // Open browser to initiate OAuth flow on server
      const result = await WebBrowser.openAuthSessionAsync(
        'http://localhost:3000/auth/google',
        'http://localhost:3000/auth/google/callback'
      );

      if (result.type === 'success') {
        // Fetch user data from server callback
        const response = await fetch('http://localhost:3000/auth/google/callback', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });

        const data = await response.json();
        if (data.user) {
          await AsyncStorage.setItem('@user', JSON.stringify(data.user));
          setUserInfo(data.user);
          return data.user;
        } else {
          throw new Error(data.error || 'Authentication failed');
        }
      } else {
        throw new Error('Authentication cancelled or failed');
      }
    } catch (error) {
      console.error('Sign-in failed:', error.message);
      throw error;
    }
  };

  return {
    userInfo,
    signInWithGoogle,
  };
}