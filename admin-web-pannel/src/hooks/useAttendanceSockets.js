import { useEffect } from "react";
import io from "socket.io-client";

export const useAttendanceSocket = (onData) => {
    useEffect(() => {
        const socket = io("http://localhost:3000");
        socket.on("attendanceUpdate", onData);
        return () => socket.disconnect();
    }, [onData]);
};
