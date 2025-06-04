import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function index() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/RoleSelectScreen'); // route to RoleSelectScreen.jsx
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/favicon.png')} style={styles.logo} />
      <Text style={styles.text}>Welcome to Smart Attendance</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  logo: { width: 100, height: 100 },
  text: { marginTop: 20, fontSize: 18, fontWeight: 'bold' },
});
