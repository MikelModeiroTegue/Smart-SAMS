import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

export default function Layout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack
        screenOptions={{
          // Modern header styling
          headerStyle: {
            backgroundColor: isDarkMode ? "#121212" : "#FFFFFF",
            elevation: 0, // Remove shadow on Android
            shadowOpacity: 0, // Remove shadow on iOS
            borderBottomWidth: 0.5,
            borderBottomColor: isDarkMode ? "#333" : "#E5E7EB",
          },
          headerTintColor: isDarkMode ? "#F5F5F5" : "#1E40AF",
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 18,
            fontFamily: "Inter-SemiBold", // Use a custom font if available
            letterSpacing: 0.5,
          },
          headerTitleAlign: "center",
          headerBackTitleVisible: false,

          // Modern card styling
          cardStyle: {
            backgroundColor: isDarkMode ? "#000000" : "#F9FAFB",
          },

          // Modern transition animations
          animation: "fade_from_bottom",
          animationDuration: 200,

          // Status bar customization
          // statusBarStyle: isDarkMode ? "light" : "dark",
          // statusBarAnimation: "fade",
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Welcome",
            headerShown: false, // Hide header for login screen
          }}
        />

        <Stack.Screen
          name="course-selection"
          options={{
            title: "Course Selection",
            headerLeft: () => null, // Remove back button
          }}
        />

        <Stack.Screen
          name="session-details/[session]"
          options={{
            title: "Session Details",
            headerStyle: {
              backgroundColor: isDarkMode ? "#1E3A8A" : "#3B82F6",
            },
            headerTintColor: "#FFFFFF",
          }}
        />

        <Stack.Screen
          name="attendance/[data]"
          options={{
            title: "Attendance",
            presentation: "modal", // Makes it slide up as a modal
            headerStyle: {
              backgroundColor: isDarkMode ? "#1E3A8A" : "#3B82F6",
            },
            headerTintColor: "#FFFFFF",
          }}
        />

        <Stack.Screen
          name="ClockIn"
          options={{
            title: "Confirmation",
            headerShown: false, // Full-screen confirmation
          }}
        />
      </Stack>
    </>
  );
}
