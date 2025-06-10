import { StyleSheet, Text, View, ActivityIndicator,TouchableOpacity, Image } from 'react-native';
import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBiometricAuth } from '@/hooks/useBiometrics';
// import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function BiometricAuthScreen() {
  const { unlocked, loading, authenticate } = useBiometricAuth();
  const router = useRouter();

  useEffect(() => {
    if (unlocked) {
      router.replace('/ClockIn');
    }
  }, [unlocked]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Biometric Authentication' }} />
      
      <View style={styles.center}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <>
            <TouchableOpacity onPress={authenticate}>
              <Image
                source={require('@/assets/faceID.png')} 
                style={styles.faceID}
              />
            </TouchableOpacity>
            <Text style={styles.instruction}>
              Tap the faceID to authenticate and Clock-In
            </Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  instruction: { fontSize: 16, color: 'gray', marginTop: 20 },
  faceID: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
});
