import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient'; // Correct import
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import api from "../api";
import { useGeofencing } from "../../hooks/useGeofence";



export default function SessionDetailsScreen() {
    const { session, user } = useLocalSearchParams();
    const parsedSession = JSON.parse(session);
    const parsedUser = JSON.parse(user); // Parse user immediately
    const router = useRouter();
    const [isEnrolled, setIsEnrolled] = useState(null);
    const [matricule, setMatricule] = useState("");
    const [instructor, setInstructor] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [joinLoading, setJoinLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                if (!parsedUser) {
                    throw new Error("User data missing from route params");
                }

                console.log("User Data:", parsedUser);

                // Fetch matricule
                const matriculeRes = await api.post("/student/matricule", {
                    email: parsedUser.email,
                });
                setMatricule(matriculeRes.data.matricule);

                // Check enrollment
                const enrollmentRes = await api.post("/enrollment/check", {
                    studentMatricule: matriculeRes.data.matricule,
                    courseID: parsedSession.course.course_ID,
                });
                setIsEnrolled(enrollmentRes.data.isEnrolled);

                // Fetch instructor
                const assignmentRes = await api.get(`/instructors/assigned/`, {
                    params: {
                        courseID: parsedSession.course.course_ID,
                    },
                });
                setInstructor(
                    assignmentRes.data[0]?.instructor?.name || "Not assigned"
                );
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.response?.data?.error || err.message);
                Alert.alert("Error", err.response?.data?.error || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [parsedSession.course.course_ID]); // Only include stable dependencies

    // const checkGeofence = async () => {
    //     try {
    //         const geolocationsRes = await api.get(
    //             `/venue/${encodeURIComponent(parsedSession.v_name)}/geolocations`
    //         );
    //         const { geolocationPolygon } = geolocationsRes.data.geolocations || {};
    //         if (!geolocationPolygon) throw new Error("Invalid geolocation data");
    //         return await useGeofencing(geolocationPolygon);
    //     } catch (err) {
    //         console.error("Geofence error:", err);
    //         throw new Error(err.response?.data?.error || err.message);
    //     }
    // };

    const handleJoinSession = async () => {
        try {
            setJoinLoading(true);
            setError("");

            if (!isEnrolled) {
                Alert.alert(
                    "Not Enrolled",
                    "You are not enrolled in this course. Would you like to enroll?",
                    [
                        { text: "Cancel", style: "cancel" },
                        {
                            text: "Enroll",
                            onPress: async () => {
                                try {
                                    await api.post("/enrollment", {
                                        studentMatricule: matricule,
                                        courseID: parsedSession.course.course_ID,
                                    });
                                    setIsEnrolled(true);
                                    await checkAndProceed();
                                } catch (err) {
                                    console.error("Enrollment error:", err);
                                    setError(err.response?.data?.error || "Failed to enroll");
                                }
                            },
                        },
                    ]
                );
                return;
            }
            await checkAndProceed();
        } catch (err) {
            console.error("Join session error:", err);
            setError(err.response?.data?.error || "Failed to join session");
        } finally {
            setJoinLoading(false);
        }
    };

    const checkAndProceed = async () => {
        try {
            // const inGeofence = await checkGeofence();
            // if (!inGeofence) {
            //     Alert.alert(
            //         "Not in Class",
            //         "Please reach the Lecture Venue and try again."
            //     );
            //     return;
            // }

            router.push({
                pathname: "/attendance/[data]",
                params: {
                    data: JSON.stringify({
                        courseID: parsedSession.course.course_ID,
                        title: parsedSession.course.title,
                        instructor,
                        studentName: parsedUser.name, // Use parsedUser directly
                        matricule,
                        email: parsedUser.email, // Use parsedUser directly
                        courseSessionID: parsedSession.ID,
                    }),
                },
            });
        } catch (err) {
            console.error("Proceed error:", err);
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6a11cb" />
                <Text style={styles.loadingText}>Loading session details...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={48} color="#ff4757" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.header}>
                <Text style={styles.title}>{parsedSession.course.course_ID}</Text>
                <Text style={styles.subtitle}>{parsedSession.course.title}</Text>
            </LinearGradient>

            <View style={styles.content}>
                <View style={styles.detailItem}>
                    <Ionicons name="person-outline" size={24} color="#6a11cb" />
                    <View style={styles.detailText}>
                        <Text style={styles.detailLabel}>Instructor</Text>
                        <Text style={styles.detailValue}>{instructor}</Text>
                    </View>
                </View>

                <View style={styles.statusContainer}>
                    <View
                        style={[
                            styles.statusIndicator,
                            {
                                backgroundColor: parsedSession.ongoing ? "#4CAF50" : "#F44336",
                            },
                        ]}
                    >
                        <Text style={styles.statusText}>
                            {parsedSession.ongoing ? "Ongoing" : "Not Ongoing"}
                        </Text>
                    </View>
                </View>

                {error && <Text style={styles.error}>{error}</Text>}

                <TouchableOpacity
                    style={[
                        styles.joinButton,
                        !parsedSession.ongoing && styles.disabledButton,
                    ]}
                    onPress={handleJoinSession}
                    // disabled={joinLoading || !parsedSession.ongoing}
                >
                    {joinLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <MaterialIcons name="meeting-room" size={20} color="#fff" />
                            <Text style={styles.buttonText}>Join Session</Text>
                        </>
                    )}
                </TouchableOpacity>
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
        padding: 25,
        paddingBottom: 30,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: "rgba(255,255,255,0.9)",
        textAlign: "center",
    },
    content: {
        padding: 20,
    },
    detailItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    detailText: {
        marginLeft: 15,
    },
    detailLabel: {
        fontSize: 14,
        color: "#95a5a6",
        marginBottom: 3,
    },
    detailValue: {
        fontSize: 16,
        color: "#2c3e50",
        fontWeight: "500",
    },
    statusContainer: {
        alignItems: "center",
        marginVertical: 20,
    },
    statusIndicator: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    statusText: {
        color: "#fff",
        fontWeight: "bold",
    },
    joinButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#6a11cb",
        padding: 16,
        borderRadius: 12,
        marginTop: 10,
    },
    disabledButton: {
        backgroundColor: "#bdc3c7",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: "#7f8c8d",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f8f9fa",
    },
    errorText: {
        fontSize: 16,
        color: "#2c3e50",
        textAlign: "center",
        marginVertical: 20,
    },
    backButton: {
        backgroundColor: "#6a11cb",
        padding: 15,
        borderRadius: 10,
        width: "100%",
        maxWidth: 200,
        alignItems: "center",
    },
    backButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    error: {
        color: "#e74c3c",
        textAlign: "center",
        marginBottom: 20,
    },
});