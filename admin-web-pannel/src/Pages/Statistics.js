import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    LineChart,
    BarChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

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
                    `Error fetching statistics: ${err.response?.data?.error || err.message}`
                );
            } finally {
                setLoading(false);
            }
        };
        fetchStatistics();
    }, []);

    // Prepare data for charts
    const chartData = statistics.map((item) => ({
        week: item.week,
        total: item.total,
        averageRate: item.averageRate,
    }));

    return (
        <div className="statistics-screen">
            <h2 className="section-title">Weekly Attendance Statistics</h2>
            {loading && <p className="loading-text">Loading...</p>}
            {error && <p className="error-text">{error}</p>}

            {!loading && !error && (
                <div className="charts-container">
                    {/* Line Chart for Attendance Trend */}
                    <div className="chart-container">
                        <h3>Weekly Attendance Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={chartData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="week" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#8884d8"
                                    activeDot={{ r: 8 }}
                                    name="Total Attendance"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Bar Chart for Average Rates */}
                    <div className="chart-container">
                        <h3>Weekly Average Attendance Rates</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={chartData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="week" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="averageRate"
                                    fill="#82ca9d"
                                    name="Average Rate (%)"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Optional: Display the raw data in cards as well */}
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
            )}
        </div>
    );
}