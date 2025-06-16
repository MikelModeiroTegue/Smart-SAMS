import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useGoogleAuthentication } from '@/services/GoogleAuth';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import StudentRegistrationForm from '../components/StudentRegistrationForm';
import { useState } from 'react';



export default function GoogleAuthScreen() {
  const { userInfo, signInWithGoogle } = useGoogleAuthentication();
  const [showRegistration, setShowRegistration] = useState(false);

  const handleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user.newUser) {
        setShowRegistration(true);
      }
      console.log('Signed in user:', user);
      
    } catch (error) {
      console.error('Sign-in error:', error.message);
    }
  };

  const handleRegistrationComplete = (registeredUser) => {
    setShowRegistration(false);
    // Update userInfo in context or state if needed
  };

  return (
    <View style={styles.container}>
      {showRegistration ? (
        <StudentRegistrationForm user={userInfo} onRegister={handleRegistrationComplete} />
      ) : userInfo && !userInfo.newUser ?
      (
        <View style={styles.profileContainer}>
          {userInfo.picture && (
            <Image source={{ uri: userInfo.picture }} style={styles.profileImage} />
          )}
          <Text style={styles.text}>Welcome, {userInfo.name}!</Text>
          <Text style={styles.text}>Email: {userInfo.email}</Text>
          
          <Link href="/GeofenceTestScreen" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.text}>Go to Geofence Test Screen</Text>
            </TouchableOpacity>
       </Link>
    </View>
      ) : (
        <>
          <Text style={styles.text}>Please sign in to continue</Text>

         <TouchableOpacity style={styles.googleButton} onPress={handleSignIn}>
            <Image
              source={{
                uri: 'https://developers.google.com/identity/images/g-logo.png',
              }}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </TouchableOpacity>
            
            <Link href="/GeofenceTestScreen" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.text}>Go to Geofence Test Screen</Text>
            </TouchableOpacity>
       </Link>

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
  button: {
    padding: 12,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
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
