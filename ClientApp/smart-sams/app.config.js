export default ({ config }) => ({
  ...config,
  expo: {
    ...config.expo,
    name: "smart-sams",
    scheme: "smart-sams",
    slug: "smart-sams",
    owner: "modeiro",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.jpg",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    appId: "e17dd81f-fbe6-4abd-a3c3-505c955091ba",
    splash: {
      image: "./assets/splash-icon.jpg",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.smartsams",
      infoPlist: {
        NSFaceIDUsageDescription:
          "This app uses Face ID to authenticate you securely.",
        UIViewControllerBasedStatusBarAppearance: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/splash-icon.jpg",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.anonymous.smartsams",
    },
    web: {
      favicon: "./assets/icon.jpg",
      bundler: "metro",
    },
    plugins: [
      "expo-web-browser",
      "expo-router",
      "expo-secure-store",
      [
        "expo-local-authentication",
        {
          faceIDPermission:
            "Allow $(PRODUCT_NAME) to use Face ID to Clock-In attendance.",
        },
      ],
    ],
    extra: {
      eas: {
        projectId: "f3b2c4d5-6e7f-8a9b-b0c1-d2e3f4g5h6i7",
      },
      androidClientId: process.env.androidClientId,
      iosClientId: process.env.iosClientId,
      webClientId: process.env.webClientId,
      redirectUri:
        process.env.redirectUri || "https://auth.expo.io/@modeiro/smartsams",
    },
  },
});
