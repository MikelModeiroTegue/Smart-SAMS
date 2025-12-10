import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "https://dear-greatly-longhorn.ngrok-free.app/api/admin", // Replace with your backend URL
  headers: { "Content-Type": "application/json" },
});

    // Add auth token to requests
    api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    });

export default api;
