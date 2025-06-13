import React, { useState } from 'react';
import { View, Text, TextInput, Picker, Button, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDeviceFingerprint, encryptFingerprint } from '@/utils/deviceInfo';


const StudentRegistrationForm = ({ user, onRegister }) => {
  const [matricule, setMatricule] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [department, setDepartment] = useState('Computer Engineering');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!matricule || !phoneNum || !department) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    setSubmitting(true);
    try {
      // Get device fingerprint
      const deviceFingerprint = await getDeviceFingerprint();
      console.log('Device Fingerprint:', deviceFingerprint);
      // Encrypt the fingerprint
      const deviceInfo = await encryptFingerprint(deviceFingerprint);
      console.log('Encrypted Fingerprint:', deviceInfo);

      const response = await axios.post('http://localhost:3000/auth/register-student', {
        matricule,
        email: user.email,
        name: user.name,
        phoneNum,
        department,
        deviceInfo,
      });
      await AsyncStorage.setItem('@user', JSON.stringify(response.data.user));
      Alert.alert('Success', 'Registration completed successfully.');
      onRegister(response.data.user);
    } catch (err) {
      console.error('Error:', err.response?.data?.error || err.message);
      Alert.alert('Error', `Failed to register: ${err.response?.data?.error || err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Complete Your Registration</Text>
      <TextInput
        placeholder="Matricule (e.g., ST12345)"
        value={matricule}
        onChangeText={setMatricule}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Phone Number (e.g., +1234567890)"
        value={phoneNum}
        onChangeText={setPhoneNum}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Picker
        selectedValue={department}
        onValueChange={setDepartment}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      >
        <Picker.Item label="Computer Engineering" value="Computer Engineering" />
        <Picker.Item label="Electrical Engineering" value="Electrical Engineering" />
        <Picker.Item label="Civil Engineering" value="Civil Engineering" />
        <Picker.Item label="Petroleum Engineering" value="Petroleum Engineering" />
        <Picker.Item label="Mechanical Engineering" value="Mechanical Engineering" />
      </Picker>
      <Button
        title={submitting ? 'Submitting...' : 'Register'}
        onPress={handleSubmit}
        disabled={submitting}
      />
    </View>
  );
};

export default StudentRegistrationForm;