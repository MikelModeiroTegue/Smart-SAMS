import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();
  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/GoogleAuthScreen");
    }, 2000); // Reduced to 2 seconds for better UX

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/splash-icon.jpg")}
        style={[
          styles.logo,
          {
            width: width * 0.5, // 50% of screen width
            height: width * 0.5, // Maintain aspect ratio
            maxWidth: 300, // Maximum size limit
            maxHeight: 300, // Maximum size limit
          },
        ]}
        resizeMode="contain"
      />
      <Text style={styles.text}>Welcome to Smart Attendance</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  logo: {
    // Dimensions now set dynamically in component
    marginBottom: 30,
  },
  text: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "600",
    color: "#1E40AF", // Modern blue color
    letterSpacing: 0.5,
    textAlign: "center",
    maxWidth: "80%",
  },
});
