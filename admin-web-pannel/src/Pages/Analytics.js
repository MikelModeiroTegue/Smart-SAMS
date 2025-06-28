import { useState, useEffect } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

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

    // Prepare data for charts
    const sortedAnalytics = [...analytics].sort(
        (a, b) => (b.rate || 0) - (a.rate || 0)
    );
    const topCourses = sortedAnalytics.slice(0, 5);
    const overallRate =
        analytics.reduce((sum, item) => sum + (item.rate || 0), 0) /
        (analytics.length || 1);

    return (
        <div className="analytics-screen">
            <h2 className="analytics-title">Attendance Analytics</h2>

            {loading && <p className="analytics-status">Loading analytics data...</p>}
            {error && <p className="analytics-error">{error}</p>}

            {analytics.length === 0 && !loading && !error && (
                <p className="analytics-empty">No analytics data available.</p>
            )}

            {analytics.length > 0 && (
                <div className="analytics-grid">
                    {/* Overall Attendance Gauge */}
                    <div className="analytics-card">
                        <h3>Overall Attendance Rate</h3>
                        <div style={{ height: "300px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: "Present", value: overallRate },
                                            { name: "Absent", value: 100 - overallRate },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        startAngle={180}
                                        endAngle={0}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell fill="#00C49F" />
                                        <Cell fill="#FF8042" />
                                    </Pie>
                                    <text
                                        x="50%"
                                        y="50%"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        {overallRate.toFixed(1)}%
                                    </text>
                                    <Tooltip
                                        formatter={(value) => [
                                            `${value.toFixed(1)}%`,
                                            value === overallRate ? "Present" : "Absent",
                                        ]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Courses Bar Chart */}
                    <div className="analytics-card">
                        <h3>Top Performing Courses</h3>
                        <div style={{ height: "300px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={topCourses}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="courseName" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip
                                        formatter={(value) => [`${value}%`, "Attendance Rate"]}
                                    />
                                    <Legend />
                                    <Bar dataKey="rate" fill="#8884d8" name="Attendance Rate">
                                        {topCourses.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* All Courses Distribution */}
                    <div className="analytics-card wide">
                        <h3>Course Attendance Distribution</h3>
                        <div style={{ height: "400px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={sortedAnalytics}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 100 }}
                                    layout="vertical"
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" domain={[0, 100]} />
                                    <YAxis
                                        type="category"
                                        dataKey="courseName"
                                        width={150}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <Tooltip
                                        formatter={(value) => [`${value}%`, "Attendance Rate"]}
                                    />
                                    <Legend />
                                    <Bar dataKey="rate" name="Attendance Rate" fill="#82ca9d">
                                        {sortedAnalytics.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Detailed Course List */}
                    <div className="analytics-card wide">
                        <h3>Detailed Course Attendance</h3>
                        <div className="analytics-table-container">
                            <table className="analytics-table">
                                <thead>
                                    <tr>
                                        <th>Course ID</th>
                                        <th>Course Name</th>
                                        <th>Attendance Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedAnalytics.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.courseID || "N/A"}</td>
                                            <td>{item.courseName || "Unknown Course"}</td>
                                            <td>
                                                <div className="progress-container">
                                                    <div
                                                        className="progress-bar"
                                                        style={{ width: `${item.rate || 0}%` }}
                                                    ></div>
                                                    <span>
                                                        {item.rate !== undefined ? `${item.rate}%` : "N/A"}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
