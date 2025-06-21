import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const ClockIn = () => {
    const router = useRouter();
    const now = new Date();
    const formattedDateTime = now.toLocaleString();

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={["#6a11cb", "#2575fc"]} // Purple to blue gradient
                style={styles.container}
            >
                <View style={styles.content}>
                    <Image
                        source={require("../assets/checking-attendance.png")}
                        style={styles.image}
                        resizeMode="contain"
                    />

                    <View style={styles.successBadge}>
                        <MaterialIcons name="check-circle" size={48} color="#4CAF50" />
                    </View>

                    <Text style={styles.title}>Attendance Recorded!</Text>
                    <Text style={styles.subtitle}>{formattedDateTime}</Text>

                    <View style={styles.detailsCard}>
                        <View style={styles.detailRow}>
                            <MaterialIcons name="fingerprint" size={24} color="#6a11cb" />
                            <Text style={styles.detailText}>
                                Biometric verification successful
                            </Text>
                        </View>
                        <View style={styles.detailRow}>
                            <MaterialIcons name="link" size={24} color="#6a11cb" />
                            <Text style={styles.detailText}>
                                Blockchain transaction confirmed
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.returnButton}
                        onPress={() => router.push("/course-selection")}
                    >
                        <MaterialIcons name="arrow-back" size={24} color="white" />
                        <Text style={styles.buttonText}>Return to Courses</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    content: {
        alignItems: "center",
        padding: 30,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: 24,
        width: width * 0.9,
        maxWidth: 400,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    image: {
        width: 180,
        height: 180,
        marginBottom: 15,
    },
    successBadge: {
        position: "absolute",
        top: -24,
        right: -24,
        backgroundColor: "white",
        borderRadius: 30,
        padding: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#2c3e50",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#7f8c8d",
        marginBottom: 25,
        textAlign: "center",
    },
    detailsCard: {
        width: "100%",
        backgroundColor: "#f8f9fa",
        borderRadius: 12,
        padding: 15,
        marginBottom: 25,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    detailText: {
        marginLeft: 10,
        fontSize: 14,
        color: "#34495e",
    },
    returnButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#6a11cb",
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 12,
        width: "100%",
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 10,
    },
});

export default ClockIn;
