import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Table from "../components/Table";
import "../css/courseSessions.css";

import { GoogleMap, Polygon, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "400px",
};

export default function CourseSessions() {
    const [sessions, setSessions] = useState([]);
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [selectedDay, setSelectedDay] = useState("Tuesday");
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [venueCoords, setVenueCoords] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 51.505, lng: -0.09 });
    const [showMap, setShowMap] = useState(false);

    // Load Google Maps script
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyAGhurzovm20oGavJzqcWFyXU_L64XFNoU", // <-- Replace with your key
    });

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
        const day = e.target.value;
        setSelectedDay(day);
        setFilteredSessions(sessions.filter((session) => session.day === day));
    };

    const fetchVenueCoordinates = async (venueName) => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/admin/venue/${encodeURIComponent(
                    venueName
                )}/geolocations`
            );

            const geolocationsArray = response.data?.geolocations;

            if (geolocationsArray && geolocationsArray.length > 0) {
                // Use all coordinates as is, convert format from [lng, lat] to {lat, lng}
                const allCoords = geolocationsArray.map((coord) => ({
                    lat: coord[1],
                    lng: coord[0],
                }));

                setVenueCoords(allCoords);

                if (allCoords.length >= 3) {
                    const lats = allCoords.map((c) => c.lat);
                    const lngs = allCoords.map((c) => c.lng);
                    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
                    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

                    setMapCenter({ lat: centerLat, lng: centerLng });
                    setShowMap(true);
                    setError(null);
                } else {
                    setError("Insufficient geofence data to display map");
                    setShowMap(false);
                }
            } else {
                setError("No geofence data available for this venue");
                setShowMap(false);
            }
        } catch (err) {
            setError("Could not load venue geofence data");
            setShowMap(false);
        }
    };

    const handleRowClick = async (session) => {
        try {
            setLoading(true);
            setAttendance(null);
            setShowMap(false);
            setError(null);

            const attendanceResponse = await axios.get(
                `http://localhost:3000/api/admin/attendance/course-session/${session.ID}`
            );

            setAttendance(attendanceResponse.data || []);

            const venue = session.venue?.v_name || session.v_name;
            if (venue) {
                await fetchVenueCoordinates(venue);
            }
        } catch (err) {
            setError(
                `Error fetching data: ${err.response?.data?.error || err.message}`
            );
        } finally {
            setLoading(false);
        }
    };

    const tableData = filteredSessions.map((session) => ({
        raw: session,
        display: {
            "Session ID": session.ID ?? "null",
            "Course Code": session.course?.course_ID ?? "null",
            "Course Title": session.course?.title ?? "null",
            Department: session.course?.department ?? "null",
            Level: session.course?.level ?? "null",
            Day: session.day ?? "null",
            "Start Time": session.start_time ?? "null",
            "End Time": session.end_time ?? "null",
            Venue: session.venue?.v_name ?? session.v_name ?? "null",
        },
    }));

    if (loadError)
        return <div>Error loading Google Maps API: {loadError.message}</div>;

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
                    data={tableData.map((row) => row.display)}
                    onRowClick={(row, index) => handleRowClick(tableData[index].raw)}
                />
            </div>

            {/* Attendance Details */}
            <div className="mt-6">
                <h3 className="text-xl font-bold mb-2 text-yellow-600">
                    Attendance Details{" "}
                    {attendance ? `(${attendance.length} records)` : ""}
                </h3>
                <div className="overflow-auto">
                    {attendance && attendance.length > 0 ? (
                        <Table
                            headers={["Student Matricule", "Date", "Blockchain TxID"]}
                            data={attendance.map((att) => ({
                                "Student Matricule": att.student_matricule ?? "null",
                                Date: att.date ? new Date(att.date).toLocaleString() : "null",
                                "Blockchain TxID": att.blockchainTxID ?? "null",
                            }))}
                        />
                    ) : (
                        <p>No attendance records available.</p>
                    )}
                </div>
            </div>

            {/* Google Map Polygon */}
            {showMap && venueCoords.length > 0 && isLoaded && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4 text-blue-600">
                        Venue Geofence ({venueCoords.length} points)
                    </h3>
                    <div
                        className="border rounded-lg overflow-hidden"
                        style={{ height: "400px" }}
                    >
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={mapCenter}
                            zoom={18}
                            options={{
                                streetViewControl: false,
                                mapTypeControl: false,
                                fullscreenControl: false,
                            }}
                        >
                            <Polygon
                                paths={venueCoords}
                                options={{
                                    fillColor: "#6366f1",
                                    fillOpacity: 0.3,
                                    strokeColor: "#6366f1",
                                    strokeOpacity: 1,
                                    strokeWeight: 3,
                                    clickable: true,
                                    editable: false,
                                    draggable: false,
                                    geodesic: false,
                                    zIndex: 1,
                                }}
                            />
                        </GoogleMap>
                    </div>
                </div>
            )}

            {/* Debug info (dev only) */}
            {process.env.NODE_ENV === "development" && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                    <h4 className="font-bold">Debug Info:</h4>
                    <p>Attendance: {attendance ? attendance.length : 0} records</p>
                    <p>Venue Coords: {venueCoords.length} points</p>
                    <p>Show Map: {showMap ? "Yes" : "No"}</p>
                    <p>
                        Map Center: [{mapCenter.lat}, {mapCenter.lng}]
                    </p>
                </div>
            )}
        </div>
    );
}
