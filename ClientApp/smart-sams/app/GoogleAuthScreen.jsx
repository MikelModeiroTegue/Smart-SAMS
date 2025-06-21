import React, { useEffect, useRef, useState } from "react";
import * as Linking from "expo-linking";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  Easing,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useGoogleAuthentication } from "@/services/GoogleAuth";
import StudentRegistrationForm from "../components/StudentRegistrationForm";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export default function GoogleAuthScreen() {
  const {
    userInfo,
    isRegistering,
    signInWithGoogle,
    setLocalUserInfo,
    setIsRegistering,
  } = useGoogleAuthentication();
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Start animations when component mounts
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Handle countdown and redirect
  useEffect(() => {
    if (shouldRedirect) {
      console.log("user info", userInfo);
      router.replace({
        pathname: "/course-selection",
        params: { user: JSON.stringify(userInfo) },
      });
    }
  }, [shouldRedirect, userInfo]);

  useEffect(() => {
    if (userInfo && !isRegistering) {
      // Animate progress bar
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      }).start();

      // Countdown timer
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setShouldRedirect(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [userInfo, isRegistering]);

  // Handle deep link after redirect from OAuth server
  useEffect(() => {
    const handleDeepLink = async ({ url }) => {
      try {
        const data = Linking.parse(url);

        if (data.queryParams?.user) {
          const parsedUser = JSON.parse(data.queryParams.user);
          setLocalUserInfo(parsedUser);
          if (parsedUser.newUser) {
            setIsRegistering(true);
          }
        } else if (data.queryParams?.error) {
          alert(
            `Authentication Error: ${decodeURIComponent(
              data.queryParams.error
            )}`
          );
        }
      } catch (error) {
        console.error("Deep link handling error:", error);
        alert("An error occurred while processing authentication");
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => subscription.remove();
  }, []);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const user = await signInWithGoogle();

      if (user) {
        if (user.newUser) {
          setIsRegistering(true);
        }
      }
    } catch (error) {
      alert(`Sign-in failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationComplete = (registeredUser) => {
    setIsRegistering(false);
    setLocalUserInfo(registeredUser);
    setShouldRedirect(true);
  };

  const handleClearStorage = async () => {
    await AsyncStorage.clear();
    alert("Local storage cleared. Please restart the app.");
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={[styles.container, styles.loadingContainer]}
      >
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Signing you in...</Text>
      </LinearGradient>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={["#f5f7fa", "#e4e8f0"]} style={styles.container}>
        <StatusBar style="dark" />

        {isRegistering ? (
          <StudentRegistrationForm
            user={userInfo}
            onRegister={handleRegistrationComplete}
          />
        ) : userInfo ? (
          <Animated.View
            style={[
              styles.profileContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.avatarContainer}>
              {userInfo.picture ? (
                <Image
                  source={{ uri: userInfo.picture }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={[styles.profileImage, styles.profilePlaceholder]}>
                  <MaterialIcons name="person" size={40} color="#fff" />
                </View>
              )}
            </View>

            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{userInfo.name}</Text>
            <Text style={styles.userEmail}>{userInfo.email}</Text>

            <View style={styles.countdownContainer}>
              <Text style={styles.countdownText}>
                Taking you to courses in {countdown}...
              </Text>
              <View style={styles.progressBarBackground}>
                <Animated.View
                  style={[
                    styles.progressBarFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", "100%"],
                      }),
                    },
                  ]}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.debugButton}
              onPress={handleClearStorage}
            >
              <MaterialIcons name="delete" size={20} color="#ff4444" />
              <Text style={styles.debugButtonText}>Clear Storage</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <Animated.View
            style={[
              styles.authContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/icon.jpg")}
                style={styles.logo}
              />
              <Text style={styles.appName}>Smart SAMS</Text>
            </View>

            <Text style={styles.tagline}>
              Your learning journey starts here
            </Text>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleSignIn}
              disabled={isLoading}
            >
              <Image
                source={{
                  uri: "https://developers.google.com/identity/images/g-logo.png",
                }}
                style={styles.googleIcon}
              />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
              By continuing, you agree to our Terms and Privacy Policy
            </Text>
          </Animated.View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "Inter-Medium",
  },
  authContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2A44",
    fontFamily: "Inter-Bold",
  },
  tagline: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 40,
    fontFamily: "Inter-Regular",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2A44",
    fontFamily: "Inter-SemiBold",
  },
  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    fontFamily: "Inter-Regular",
    marginTop: 24,
  },
  profileContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  avatarContainer: {
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  profilePlaceholder: {
    backgroundColor: "#667eea",
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 18,
    color: "#6B7280",
    marginBottom: 4,
    fontFamily: "Inter-Regular",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2A44",
    marginBottom: 8,
    fontFamily: "Inter-Bold",
    textAlign: "center",
  },
  userEmail: {
    fontSize: 16,
    color: "#9CA3AF",
    marginBottom: 24,
    fontFamily: "Inter-Regular",
  },
  countdownContainer: {
    width: "100%",
    marginBottom: 32,
  },
  countdownText: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 8,
    textAlign: "center",
    fontFamily: "Inter-Medium",
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
    width: "100%",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#667eea",
    borderRadius: 3,
  },
  debugButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 16,
  },
  debugButtonText: {
    fontSize: 14,
    color: "#ff4444",
    marginLeft: 8,
    fontFamily: "Inter-Medium",
  },
});
