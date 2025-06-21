import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../components/Table";

export default function CourseSessions() {
    const [sessions, setSessions] = useState([]);
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [selectedDay, setSelectedDay] = useState("Tuesday");
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    "http://localhost:3000/api/admin/schedules"
                );

                setSessions(response.data);

                setFilteredSessions(
                    response.data.filter((session) => session.day === selectedDay)
                );

                console.log("Fetched sessions:", response.data);
            } catch (err) {
                setError(
                    `Error fetching sessions: ${err.response?.data?.error || err.message}`
                );
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, [selectedDay]);

    const handleDayChange = (e) => {
        setSelectedDay(e.target.value);
        setFilteredSessions(
            sessions.filter((session) => session.day === e.target.value)
        );
    };

    const handleRowClick = async (session) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:3000/api/admin/attendance/course/:${session.courseID}`
            );
            setAttendance(response.data);
        } catch (err) {
            setError(
                `Error fetching attendance: ${err.response?.data?.error || err.message}`
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-content">
            <h2 className="page-header">Course Sessions</h2>

            <div className="filter-controls">
                <label>Filter by Day:</label>
                <select
                    value={selectedDay}
                    onChange={handleDayChange}
                    className="filter-section"
                >
                    {["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
                        (day) => (
                            <option key={day} value={day}>
                                {day}
                            </option>
                        )
                    )}
                </select>
            </div>

            {loading && <p className="text-gray-600">Loading...</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="table-container">
                <Table
                    headers={[
                        "Session ID",
                        "Course Code",
                        "Course Title",
                        "Department",
                        "Level",
                        "Day",
                        "Start Time",
                        "End Time",
                        "Venue",
                    ]}
                    data={filteredSessions.map((session) => ({
                        "Session ID": session.ID || "N/A",
                        "Course Code": session.course?.course_ID || "N/A",
                        "Course Title": session.course?.title || "N/A",
                        Department: session.course?.department || "N/A",
                        Level: session.course?.level || "N/A",
                        Day: session.day || "N/A",
                        "Start Time": session.start_time || "N/A",
                        "End Time": session.end_time || "N/A",
                        Venue: session.venue?.v_name || session.v_name || "N/A",
                    }))}
                    onRowClick={handleRowClick}
                />
            </div>

            {attendance && (
                <div className="mt-6">
                    <h3 className="text-xl font-bold mb-2 text-yellow-600">
                        Attendance Details
                    </h3>

                    <div className="overflow-auto">
                        <Table
                            headers={["Student Matricule", "Date", "Blockchain TxID"]}
                            data={attendance.map((att) => ({
                                "Student Matricule": att.student_matricule || "N/A",
                                Date: new Date(att.date).toLocaleString() || "N/A",
                                "Blockchain TxID": att.blockchainTxID || "N/A",
                            }))}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
