import { useEffect } from "react"
import * as LocalAuthentication from "expo-local-authentication"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Alert } from "react-native";


export default function BiometricService() {
    const [unlocked, setUnlocked] = useState(false)

    console.warn("Biometric Authentication")

    useEffect(() => {
        authenticateBiometric().catch((error) => {
            console.error("Biometric authentication failed:", error)})
    }, [])


    const authenticateBiometric = async () => { 

        const enrolled = await LocalAuthentication.getEnrolledLevelAsync()
        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync()
        const hasHardware = await LocalAuthentication.hasHardwareAsync()

        console.log("Biometric hardware available:", hasHardware)
        console.log("Enrolled biometric types:", enrolled)
        console.log("Supported biometric types:", supportedTypes)

        if (!hasHardware) { Alert.alert("Biometric hardware not available", "This device does not support biometric authentication."); return; }
 
        const response = await LocalAuthentication.authenticateAsync()   
        console.log("Biometric authentication response:", response)
        if (response.success) {
            setUnlocked(true)
        }
    }  


    if (!unlocked) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <FontAwesome5 name="fingerprint" onPress={ authenticateBiometric } size={85} color="gray" />
                <Text style={{ fontFamily: 'Inter', fontSize: 20, marginBottom: 20 }}>Authenticate yourself for you to Clock-IN</Text>
            </View>
        )
    }
}