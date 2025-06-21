import { useState, useEffect } from "react";
import axios from "axios";

export default function Analytics() {
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    "http://localhost:3000/api/admin/analytics/attendance-rate"
                );
                setAnalytics(response.data);
            } catch (err) {
                setError(
                    `Error fetching analytics: ${err.response?.data?.error || err.message
                    }`
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    return (
        <div className="analytics-screen">
            <h2 className="analytics-title">Analytics</h2>

            {loading && <p className="analytics-status">Loading...</p>}
            {error && <p className="analytics-error">{error}</p>}

            <div className="analytics-grid">
                {analytics.length === 0 && !loading && !error && (
                    <p className="analytics-empty">No analytics data available.</p>
                )}
                {analytics.map((item, index) => (
                    <div key={index} className="analytics-card">
                        <h3 className="analytics-course">
                            {item.courseID || "Unknown Course"}
                        </h3>
                        <p className="analytics-rate">
                            Attendance Rate:{" "}
                            {item.rate !== undefined ? `${item.rate}%` : "N/A"}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
