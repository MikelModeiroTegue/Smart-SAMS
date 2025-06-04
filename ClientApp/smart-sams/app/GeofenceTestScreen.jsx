import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGeofence } from '@/hooks/useGeofence';
import { Link } from 'expo-router';

export default function GeofenceTestScreen() {
  const { isInsidePolygon, isMocked, isEmulator, error } = useGeofence();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Geo-fencing Status</Text>

      {error && <Text style={styles.error}> {error}</Text>}
      {isEmulator && <Text style={styles.error}> Cannot use this app on an emulator.</Text>}
      {isMocked && <Text style={styles.error}> Fake GPS Detected. Access Denied.</Text>}

      {!isMocked && !isEmulator && isInsidePolygon !== null && (
        <Text style={{ color: isInsidePolygon ? 'green' : 'orange' }}>
          You are {isInsidePolygon ? ' inside' : '❌ outside'} the geofence.
        </Text>
      )}

      <Link href="/BiometricAuthScreen" asChild>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.text}>Go to Biometric Verification</Text>
                  </TouchableOpacity>
      </Link>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});
