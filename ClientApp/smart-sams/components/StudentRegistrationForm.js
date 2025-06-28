import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDeviceFingerprint, encryptFingerprint } from "@/utils/deviceInfo";
import { Picker } from "@react-native-picker/picker";

const StudentRegistrationForm = ({ user, onRegister }) => {
  const [matricule, setMatricule] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [department, setDepartment] = useState("Computer Engineering");
  const [submitting, setSubmitting] = useState(false);

  const departments = [
    "Computer Engineering",
    "Electrical Engineering",
    "Civil Engineering",
    "Petroleum Engineering",
    "Mechanical Engineering",
  ];

  const handleSubmit = async () => {
    if (!matricule || !phoneNum || !department) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    setSubmitting(true);
    try {
      const deviceFingerprint = await getDeviceFingerprint();
      // const deviceInfo = await encryptFingerprint(deviceFingerprint);

      const response = await axios.post(
        "https://2b1a-129-0-102-36.ngrok-free.app/auth/register-student",
        {
          matricule,
          email: user.email,
          name: user.name,
          phoneNum,
          department,
          deviceFingerprint, // Use the fingerprint directly for now
        }
      );

      await AsyncStorage.setItem("@user", JSON.stringify(response.data.user));
      Alert.alert("Success", "Registration completed successfully.");
      onRegister(response.data.user);
    } catch (err) {
      Alert.alert(
        "Error",
        `Failed to register: ${err.response?.data?.error || err.message}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Complete Your Registration</Text>
        <Text style={styles.subHeader}>
          Fill in your details to get started
        </Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Matricule Number</Text>
        <TextInput
          placeholder="ST12345"
          placeholderTextColor="#999"
          value={matricule}
          onChangeText={setMatricule}
          style={styles.input}
          autoCapitalize="characters"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          placeholder="+1234567890"
          placeholderTextColor="#999"
          value={phoneNum}
          onChangeText={setPhoneNum}
          style={styles.input}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Department</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={department}
            onValueChange={setDepartment}
            style={styles.picker}
            dropdownIconColor="#666"
          >
            {departments.map((dept) => (
              <Picker.Item key={dept} label={dept} value={dept} />
            ))}
          </Picker>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, submitting && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Complete Registration</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = {
  container: {
    flexGrow: 1,
    padding: 25,
    backgroundColor: "#f8f9fa",
  },
  header: {
    marginBottom: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#34495e",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dfe6e9",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: "#2d3436",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dfe6e9",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  picker: {
    height: 50,
    color: "#2d3436",
  },
  button: {
    backgroundColor: "#3498db",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#2980b9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#bdc3c7",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
};

export default StudentRegistrationForm;
