import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useGoogleAuthentication() {
  const [userInfo, setUserInfo] = React.useState(null);
  const [isRegistering, setIsRegistering] = React.useState(false);

  // Load user if already signed in
  React.useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("@user");
        if (storedUser) {
          setUserInfo(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };
    loadStoredUser();
  }, []);

  const setLocalUserInfo = async (userData) => {
    try {
      await AsyncStorage.setItem("@user", JSON.stringify(userData));
      setUserInfo(userData);
      setIsRegistering(userData?.newUser || false);
    } catch (error) {
      console.error("Failed to save user:", error);
      throw error;
    }
  };

  // Trigger server-side Google OAuth
  const signInWithGoogle = async () => {
    try {
      // Use ngrok URL for development
      const authUrl =
        "https://dear-greatly-longhorn.ngrok-free.app/auth/google";

      // Use expo's auth proxy URL as redirect
      const redirectUrl = "exp://auth.expo.io/@modeiro/smart-sams";

      // Open auth session
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUrl
      );

      if (result.type === "success") {
        const parsedUrl = Linking.parse(result.url);

        if (parsedUrl.queryParams?.user) {
          const user = JSON.parse(parsedUrl.queryParams.user);
          await setLocalUserInfo(user);
          return user;
        } else if (parsedUrl.queryParams?.error) {
          throw new Error(parsedUrl.queryParams.error);
        }
      } else if (result.type === "cancel") {
        throw new Error("Authentication cancelled by user");
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      console.error("Sign-in failed:", error);
      throw error;
    }
  };

  return {
    userInfo,
    isRegistering,
    setIsRegistering,
    signInWithGoogle,
    setLocalUserInfo,
  };
}
