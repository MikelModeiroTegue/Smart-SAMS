import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import RoleCard from '../components/RoleCard';

export default function RoleSelectScreen({ navigation }) {
  const handleSelect = (role) => {
    navigation.navigate('GoogleAuth', { role });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Role</Text>
      <View style={styles.roles}>
        <RoleCard title="Instructor" icon="school" onPress={() => handleSelect('instructor')} />
        <RoleCard title="Student" icon="person" onPress={() => handleSelect('student')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  roles: { flexDirection: 'row', gap: 20 },
});
