

// utils/deviceFingerprint.js
import * as Device from 'expo-device';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Simple AES-GCM Encryption / Decryption Helper
const ENCRYPTION_KEY = 'GhostHardin'; // Replace with a securely stored key

// 1 Get Device Info (Non-User Editable & Stable)
export const getDeviceFingerprint = async () => {
  const isAndroid = Platform.OS === 'android';
  const isIOS = Platform.OS === 'ios';

  const DeviceData = {
    brand: Device.brand || '',
    modelId: Device.modelId || '',
    modelName: Device.modelName || '',
    osName: Device.osName || '',
    totalMemory: Device.totalMemory?.toString() || '',
    supportedArchitectures: (Device.supportedCpuArchitectures || []).join(','),
    osInternalBuildId: isAndroid ? Device.osInternalBuildId || '' : '',
    platformApiLevel: isAndroid ? Device.platformApiLevel?.toString() || '' : '',
  };

  return JSON.stringify(DeviceData);
};

// 2 Encrypt Fingerprint
export const encryptFingerprint = async (plaintext) => {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    ENCRYPTION_KEY
  );

  const key = digest.slice(0, 32); // AES-256 key length
  const iv = Crypto.getRandomBytes(12); // AES-GCM nonce (12 bytes)

  const encrypted = await Crypto.encryptAsync({
    algorithm: Crypto.CryptoEncryptionAlgorithm.AES_GCM,
    key,
    iv,
    plaintext,
  });

  // Store base64 string (IV + Ciphertext)
  const encodedIV = Buffer.from(iv).toString('base64');
  const encodedCipher = Buffer.from(encrypted.ciphertext).toString('base64');

  return `${encodedIV}:${encodedCipher}`;
};

// 3 Decrypt Fingerprint
export const decryptFingerprint = async (encrypted) => {
  const [encodedIV, encodedCipher] = encrypted.split(':');

  const iv = Buffer.from(encodedIV, 'base64');
  const ciphertext = Buffer.from(encodedCipher, 'base64');

  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    ENCRYPTION_KEY
  );

  const key = digest.slice(0, 32);

  const decrypted = await Crypto.decryptAsync({
    algorithm: Crypto.CryptoEncryptionAlgorithm.AES_GCM,
    key,
    iv,
    ciphertext,
  });

  return decrypted.plaintext;
};
