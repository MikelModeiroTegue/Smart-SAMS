// hooks/useBiometricAuth.js
import { useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

export function useBiometricAuth() {
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const authenticate = async () => {
    try {
      setLoading(true);

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        alert("This device doesn't support biometric auth");
        return;
      }
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

        console.log("Enrolled biometric types:", enrolled);
        console.log("Supported biometric types:", supportedTypes);

      const response = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to Clock-In',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use Passcode', // Important to force biometric scan
      });

        console.log("Biometric authentication response:", response);
        
      if (response.success) {
        setUnlocked(true);
      } else {
        alert("Authentication failed");
      }
    } catch (err) {
      console.error('Biometric Auth Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { unlocked, loading, authenticate };
}
