import React, { useState } from "react";
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
import LottieView from "lottie-react-native";

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
    const {
        unlocked,
        loading: biometricLoading,
        authenticate,
    } = useBiometricAuth();
    const router = useRouter();
    const [transactionLoading, setTransactionLoading] = useState(false);

    const markAttendance = async () => {
        try {
            await authenticate();
            if (unlocked) {
                setTransactionLoading(true);

                // Step 1: Request blockchain transaction
                const blockchainResponse = await axios.post(
                  "https://dear-greatly-longhorn.ngrok-free.app/api/transaction/clockin",
                  {
                    studentName,
                    matricule,
                    email,
                    courseSessionID,
                  }
                );

                if (blockchainResponse.data?.transactionId) {
                    const txId = blockchainResponse.data.transactionId;

                    console.log("Blockchain transaction ID:", txId);

                    // Step 2: Store attendance in attendance table
                    const attendanceResponse = await axios.post(
                      "https://dear-greatly-longhorn.ngrok-free.app/api/admin/attendance/store",
                      {
                        courseSessionSchedule_ID: courseSessionID,
                        student_matricule: matricule,
                        blockchainTxID: txId,
                        date: new Date().toISOString(),
                      }
                    );

                    if (attendanceResponse.data?.success) {
                        Alert.alert("Success", `Attendance marked for ${courseID}`, [
                            { text: "OK", onPress: () => router.push("/ClockIn") },
                        ]);
                    } else {
                        throw new Error("Failed to store attendance record");
                    }
                } else {
                    throw new Error("Blockchain transaction failed");
                }
            }
        } catch (error) {
            Alert.alert("Error", `Failed to mark attendance: ${error.message}`, [
                { text: "OK" },
            ]);
            console.error("Attendance error:", error);
        } finally {
            setTransactionLoading(false);
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

                {biometricLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#6a11cb" />
                        <Text style={styles.loadingText}>Verifying your identity...</Text>
                    </View>
                ) : transactionLoading ? (
                    <View style={styles.transactionProcessingContainer}>
                        <LottieView
                            autoPlay
                            loop
                            source={require("../../assets/blockchain-loading.json")}
                            style={styles.lottieAnimation}
                        />
                        <Text style={styles.processingText}>
                            Processing Blockchain Transaction...
                        </Text>
                        <Text style={styles.processingSubtext}>
                            This may take a few moments
                        </Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.attendanceButton}
                        onPress={markAttendance}
                        disabled={biometricLoading || transactionLoading}
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
    transactionProcessingContainer: {
        alignItems: "center",
        padding: 30,
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 15,
        marginTop: 10,
    },
    lottieAnimation: {
        width: 150,
        height: 150,
    },
    processingText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#2c3e50",
        marginTop: 15,
        textAlign: "center",
    },
    processingSubtext: {
        fontSize: 14,
        color: "#7f8c8d",
        marginTop: 5,
        textAlign: "center",
    },
});
