import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useGoogleAuthentication } from '../services/GoogleAuth';
import { StatusBar } from 'expo-status-bar';

export default function AuthenticationScreen() {
  const { userInfo, promptAsync, request } = useGoogleAuthentication();

  return (
    <View style={styles.container}>
      {userInfo ? (
        <View style={styles.profileContainer}>
          {userInfo.picture && (
            <Image source={{ uri: userInfo.picture }} style={styles.profileImage} />
          )}
          <Text style={styles.text}>Welcome, {userInfo.name}!</Text>
          <Text style={styles.text}>Email: {userInfo.email}</Text>
        </View>
      ) : (
        <>
          <Text style={styles.text}>Please sign in to continue</Text>

         <TouchableOpacity disabled={!request} style={styles.googleButton} onPress={() => { if (request) promptAsync() }}>
            <Image
              source={{
                uri: 'https://developers.google.com/identity/images/g-logo.png',
              }}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>
        </>
      )}

      <StatusBar style="auto" />
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
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
});
