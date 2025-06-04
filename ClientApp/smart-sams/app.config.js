export default ({ config }) => ({
  ...config,
  expo: {
    ...config.expo,
    name: "smart-sams",
    scheme: "smart-sams",
    slug: "smart-sams",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/favicon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.smartsams",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.anonymous.smartsams",
    },
    web: {
      favicon: "./assets/favicon.png",
      "bundler": "metro",
    },
    plugins: [
      "expo-web-browser",
      "expo-router",
      [
        "expo-local-authentication",
        {
          "faceIDPermission": "Allow $(PRODUCT_NAME) to use Face ID to Clock-In attendance."
        }
      ]
    ],
    extra: {
      eas: {
        projectId: "f3b2c4d5-6e7f-8a9b-b0c1-d2e3f4g5h6i7",
      },
      androidClientId: process.env.androidClientId,
      iosClientId: process.env.iosClientId,
      webClientId: process.env.webClientId,
    },
  },
});
