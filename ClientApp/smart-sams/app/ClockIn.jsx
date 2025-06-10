import {  View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';

const ClockIn = () => {

    // Get current date and time
    const now = new Date();

  // Format date and time as you like, e.g., "YYYY-MM-DD HH:mm:ss"
    const formattedDateTime = now.toLocaleString();
    
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/checking-attendance.png')}
                style={styles.image}
                resizeMode="contain"
            />
            <Text style={styles.text}>ClockIn at time succesfull</Text>
            <Text style={styles.text}>Current Date and Time: {formattedDateTime}</Text>
        </View>
    );
}

export default ClockIn;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    image: {
        width: 200,
        height: 200,
      },
});
