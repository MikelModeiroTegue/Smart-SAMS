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

      const response = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to Clock-In',
        fallbackLabel: 'Use Passcode',
      });

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
