import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import api from "./api";

export default function CourseSelectionScreen() {
    const { user } = useLocalSearchParams();
    const userInfo = user ? JSON.parse(user) : null;
    const [level, setLevel] = useState("");
    const [department, setDepartment] = useState("");
    const [sessions, setSessions] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setError("");
            if (!level || !department) {
                setError("Please enter level and department");
                return;
            }

            setLoading(true);
            const response = await api.get("/sessions", {
                params: {
                    level: level,
                    department: department,
                },
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.data && response.data.length > 0) {
                setSessions(response.data);
            } else {
                Alert.alert("No Results", "No courses found for the selected criteria");
                setSessions([]);
            }
        } catch (err) {
            console.error("API Error:", err);
            setError(
                err.response?.data?.message ||
                "Failed to fetch sessions. Please try again."
            );
            Alert.alert(
                "Error",
                err.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    const renderSessionCard = ({ item }) => (
        <Link
            href={{
                pathname: "/session-details/[session]",
                params: {
                    session: JSON.stringify(item),
                    user: JSON.stringify(userInfo),
                },
            }}
            asChild
        >
            <TouchableOpacity style={styles.card}>
                <Text style={styles.cardTitle}>{item.course.course_ID}</Text>
                <Text style={styles.cardSubtitle}>{item.course.title}</Text>
                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: item.ongoing ? "#4CAF50" : "#F44336" },
                    ]}
                >
                    <Text style={styles.statusText}>
                        {item.ongoing ? "Ongoing" : "Not Ongoing"}
                    </Text>
                </View>
            </TouchableOpacity>
        </Link>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.header}>Course Selection</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Level (example: 200)</Text>
                    <TextInput
                        style={styles.input}
                        value={level}
                        onChangeText={setLevel}
                        placeholder="Enter level"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>
                        Department (example: Computer Science)
                    </Text>
                    <TextInput
                        style={styles.input}
                        value={department}
                        onChangeText={setDepartment}
                        placeholder="Enter department"
                        placeholderTextColor="#999"
                    />
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Find Courses</Text>
                    )}
                </TouchableOpacity>

                {sessions.length > 0 && (
                    <Text style={styles.resultsTitle}>Available Courses</Text>
                )}

                <FlatList
                    data={sessions}
                    renderItem={renderSessionCard}
                    keyExtractor={(item) => item.ID.toString()}
                    numColumns={2}
                    scrollEnabled={false}
                    contentContainerStyle={styles.listContainer}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#2c3e50",
        marginBottom: 30,
        textAlign: "center",
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: "#34495e",
        marginBottom: 8,
        fontWeight: "500",
    },
    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#dfe6e9",
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        color: "#2d3436",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    error: {
        color: "#e74c3c",
        marginBottom: 20,
        textAlign: "center",
        fontSize: 14,
    },
    button: {
        backgroundColor: "#3498db",
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        shadowColor: "#2980b9",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    resultsTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2c3e50",
        marginBottom: 15,
        marginTop: 10,
    },
    listContainer: {
        paddingBottom: 20,
    },
    card: {
        flex: 1,
        margin: 8,
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        minHeight: 120,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2c3e50",
        marginBottom: 5,
    },
    cardSubtitle: {
        fontSize: 14,
        color: "#7f8c8d",
        marginBottom: 10,
    },
    statusBadge: {
        alignSelf: "flex-start",
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        marginTop: "auto",
    },
    statusText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
});
