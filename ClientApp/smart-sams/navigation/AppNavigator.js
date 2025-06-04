import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import SplashScreen from '../app/SplashScreen';
import RoleSelectScreen from '../app/RoleSelectScreen';
import GeofenceScreen from '../app/GeofenceTestScreen';
import AuthenticationScreen from '../app/GoogleAuthScreen';
// import BiometricAuthScreen from '../screens/BiometricAuthScreen';
// import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
        <Stack.Screen name="GoogleAuth" component={AuthenticationScreen} />
        <Stack.Screen name="Geofence" component={GeofenceScreen} />
        {/* <Stack.Screen name="BiometricAuth" component={BiometricAuthScreen} />
        <Stack.Screen name="Home" component={HomeScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
