import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('RoleSelect');
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/favicon.png')} style={styles.logo} />
      <Text style={styles.text}>Welcome to Smart Attendance</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  logo: { width: 100, height: 100 },
  text: { marginTop: 20, fontSize: 18, fontWeight: 'bold' },
});
