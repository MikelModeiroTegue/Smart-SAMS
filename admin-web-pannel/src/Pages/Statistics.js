import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Statistics() {
    const [statistics, setStatistics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    "http://localhost:3000/api/admin/statistics/weekly-attendance"
                );
                setStatistics(response.data);
            } catch (err) {
                setError(
                    `Error fetching statistics: ${err.response?.data?.error || err.message
                    }`
                );
            } finally {
                setLoading(false);
            }
        };
        fetchStatistics();
    }, []);

    return (
        <div className="statistics-screen">
            <h2 className="section-title">Statistics</h2>
            {loading && <p className="loading-text">Loading...</p>}
            {error && <p className="error-text">{error}</p>}
            <div className="statistics-grid">
                {statistics.map((item, index) => (
                    <div key={index} className="statistic-card">
                        <h3 className="stat-week">{item.week}</h3>
                        <p className="stat-total">Total Attendance: {item.total}</p>
                        <p className="stat-rate">Average Rate: {item.averageRate}%</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
