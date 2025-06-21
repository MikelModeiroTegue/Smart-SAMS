import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useBiometricAuth } from "@/hooks/useBiometrics";
import api from "../api";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import axios from "axios";

export default function AttendanceScreen() {
    const { data } = useLocalSearchParams();
    const {
        courseID,
        title,
        instructor,
        studentName,
        matricule,
        email,
        courseSessionID,
    } = JSON.parse(data);
    const { unlocked, loading, authenticate } = useBiometricAuth();
    const router = useRouter();

    const markAttendance = async () => {
        try {
            await authenticate();
            if (unlocked) {
                // Step 1: Request blockchain transaction
                const blockchainResponse = await axios.post("https://7f14-129-0-205-32.ngrok-free.app/api/transaction/clockin",
                    {
                        studentName,
                        matricule,
                        email,
                        courseSessionID,
                    }
                );

                if (blockchainResponse.data && blockchainResponse.data.txId) {
                    const txId = blockchainResponse.data.txId;

                    // Step 2: Store attendance in attendance table
                    const attendanceResponse = await api.post("/admin/attendance/store", {
                        courseSessionSchedule_ID: courseSessionID,
                        student_matricule: matricule,
                        txId,
                        date: new Date().toISOString(),
                    });

                    if (attendanceResponse.data && attendanceResponse.data.success) {
                        Alert.alert("Success", `Attendance marked for ${courseID}`, [
                            {
                                text: "OK",
                                onPress: () => router.push("/ClockIn"),
                            },
                        ]);
                    } else {
                        throw new Error("Failed to store attendance record");
                    }
                } else {
                    throw new Error("Blockchain transaction failed or no TxID returned");
                }
            }
        } catch (error) {
            console.error("Attendance marking failed:", error.message);
            Alert.alert("Error", `Failed to mark attendance: ${error.message}`, [
                { text: "OK" },
            ]);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.header}>
                <Text style={styles.courseCode}>{courseID}</Text>
                <Text style={styles.courseTitle}>{title}</Text>
            </LinearGradient>

            <View style={styles.content}>
                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Ionicons name="person-outline" size={24} color="#6a11cb" />
                        <View style={styles.infoText}>
                            <Text style={styles.infoLabel}>Instructor</Text>
                            <Text style={styles.infoValue}>{instructor}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <FontAwesome5 name="user-graduate" size={20} color="#6a11cb" />
                        <View style={styles.infoText}>
                            <Text style={styles.infoLabel}>Student</Text>
                            <Text style={styles.infoValue}>{studentName}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <MaterialIcons name="fingerprint" size={24} color="#6a11cb" />
                        <View style={styles.infoText}>
                            <Text style={styles.infoLabel}>Matricule</Text>
                            <Text style={styles.infoValue}>{matricule}</Text>
                        </View>
                    </View>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#6a11cb" />
                        <Text style={styles.loadingText}>Verifying your identity...</Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.attendanceButton}
                        onPress={markAttendance}
                    // disabled={loading}
                    >
                        <MaterialIcons name="how-to-reg" size={24} color="white" />
                        <Text style={styles.buttonText}>Mark Attendance</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#f8f9fa",
    },
    header: {
        padding: 30,
        paddingBottom: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: "center",
    },
    courseCode: {
        fontSize: 28,
        fontWeight: "bold",
        color: "white",
        marginBottom: 5,
    },
    courseTitle: {
        fontSize: 18,
        color: "rgba(255,255,255,0.9)",
        textAlign: "center",
    },
    content: {
        padding: 20,
        marginTop: 20,
    },
    infoCard: {
        backgroundColor: "white",
        borderRadius: 15,
        padding: 20,
        marginBottom: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    infoText: {
        marginLeft: 15,
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        color: "#95a5a6",
        marginBottom: 3,
    },
    infoValue: {
        fontSize: 16,
        color: "#2c3e50",
        fontWeight: "500",
    },
    attendanceButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#6a11cb",
        padding: 18,
        borderRadius: 12,
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
    },
    loadingContainer: {
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 15,
        color: "#7f8c8d",
        fontSize: 16,
    },
});
