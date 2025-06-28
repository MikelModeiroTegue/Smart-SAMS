import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalStudents: { value: 0, loading: true, error: null },
    totalCourses: { value: 0, loading: true, error: null },
    totalInstructors: { value: 0, loading: true, error: null },
    totalSessions: { value: 0, loading: true, error: null },
    overallAttendanceRate: { value: 0, loading: true, error: null },
    recentAttendance: { value: [], loading: true, error: null },
    weeklyStats: { value: [], loading: true, error: null },
    attendanceRates: { value: [], loading: true, error: null },
  });

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const getCurrentWeek = () => {
    const today = new Date();
    const oneJan = new Date(today.getFullYear(), 0, 1);
    return Math.ceil(((today - oneJan) / 86400000 + oneJan.getDay() + 1) / 7);
  };

  const fetchData = useCallback(async (endpoint, key) => {
    try {
      setMetrics((prev) => ({
        ...prev,
        [key]: { ...prev[key], loading: true, error: null },
      }));

      const response = await axios.get(endpoint);

      if (response.status !== 200) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      let value;

      switch (key) {
        case "totalStudents":
        case "totalCourses":
        case "totalInstructors":
        case "totalSessions":
          value = Array.isArray(response.data) ? response.data.length : 0;
          break;

        case "overallAttendanceRate":
          const ratesData = Array.isArray(response.data) ? response.data : [];
          const validRates = ratesData.filter(
            (item) => !item.error && typeof item.rate === "number"
          );
          value =
            validRates.length > 0
              ? validRates.reduce((sum, item) => sum + item.rate, 0) /
                validRates.length
              : 0;
          break;

        case "recentAttendance":
          value = Array.isArray(response.data)
            ? response.data
                .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
                .slice(0, 5)
            : [];
          break;

        case "weeklyStats":
          value = Array.isArray(response.data)
            ? response.data.map((item) => ({
                ...item,
                averageRate:
                  typeof item.averageRate === "number" ? item.averageRate : 0,
              }))
            : [];
          break;

        case "attendanceRates":
          value = Array.isArray(response.data)
            ? response.data.filter(
                (item) => !item.error && item.rate !== undefined
              )
            : [];
          break;

        default:
          value = response.data;
      }

      setMetrics((prev) => ({
        ...prev,
        [key]: { value, loading: false, error: null },
      }));
    } catch (err) {
      console.error(`Error fetching ${key}:`, err);
      setMetrics((prev) => ({
        ...prev,
        [key]: {
          value: prev[key].value,
          loading: false,
          error: err.message,
        },
      }));
    }
  }, []);

  useEffect(() => {
    fetchData("http://localhost:3000/api/admin/students", "totalStudents");
    fetchData("http://localhost:3000/api/admin/courses", "totalCourses");
    fetchData(
      "http://localhost:3000/api/admin/instructors",
      "totalInstructors"
    );
    fetchData("http://localhost:3000/api/admin/schedules", "totalSessions");
    fetchData(
      "http://localhost:3000/api/admin/analytics/attendance-rate",
      "overallAttendanceRate"
    );
    fetchData("http://localhost:3000/api/admin/attendance", "recentAttendance");
    fetchData(
      "http://localhost:3000/api/admin/statistics/weekly-attendance",
      "weeklyStats"
    );
    fetchData(
      "http://localhost:3000/api/admin/analytics/attendance-rate",
      "attendanceRates"
    );
  }, [fetchData]);

  // Prepare data for charts
  const summaryData = [
    { name: "Students", value: metrics.totalStudents.value },
    { name: "Courses", value: metrics.totalCourses.value },
    { name: "Instructors", value: metrics.totalInstructors.value },
    { name: "Sessions", value: metrics.totalSessions.value },
  ];

  const currentWeekData =
    metrics.weeklyStats.value.length > 0
      ? metrics.weeklyStats.value
          .filter((item) => {
            const weekNum = parseInt(item.week?.split(" ")[1]);
            return weekNum === getCurrentWeek();
          })
          .map((item) => ({
            name: item.week,
            attendance: item.total,
            rate: item.averageRate,
          }))
      : [{ name: "Current Week", attendance: 0, rate: 0 }];

  return (
    <div className="dashboard-screen">
      <h2 className="dashboard-title">Dashboard Analytics</h2>

      {Object.values(metrics).some((m) => m.loading) && (
        <p className="dashboard-status">Loading dashboard data...</p>
      )}

      {Object.values(metrics).some((m) => m.error) && (
        <p className="dashboard-error">
          {Object.values(metrics)
            .filter((m) => m.error)
            .map((m, i, arr) => `${m.error}${i < arr.length - 1 ? ", " : ""}`)}
        </p>
      )}

      {!Object.values(metrics).some((m) => m.loading || m.error) && (
        <div className="dashboard-grid">
          {/* Summary Pie Chart */}
          <div className="dashboard-card">
            <h3>System Overview</h3>
            <div style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summaryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {summaryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attendance Rate Gauge */}
          <div className="dashboard-card">
            <h3>Overall Attendance Rate</h3>
            <div style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Present",
                        value: metrics.overallAttendanceRate.value,
                      },
                      {
                        name: "Absent",
                        value: 100 - metrics.overallAttendanceRate.value,
                      },
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
                    {metrics.overallAttendanceRate.value.toFixed(1)}%
                  </text>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Attendance Trend */}
          <div className="dashboard-card wide">
            <h3>Weekly Attendance Trend</h3>
            <div style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={metrics.weeklyStats.value}
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
                  <Line
                    type="monotone"
                    dataKey="averageRate"
                    stroke="#82ca9d"
                    name="Average Rate (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Course-wise Attendance */}
          <div className="dashboard-card wide">
            <h3>Course-wise Attendance Rates</h3>
            <div style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metrics.attendanceRates.value}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="courseName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="rate"
                    fill="#8884d8"
                    name="Attendance Rate (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Attendance Table */}
          <div className="dashboard-card wide">
            <h3>Recent Attendance Records</h3>
            <div className="attendance-table-container">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Date</th>
                    <th>Session</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.recentAttendance.value.map((att, index) => (
                    <tr key={index}>
                      <td>{att.student_matricule || "N/A"}</td>
                      <td>{att.courseSession?.course?.name || "N/A"}</td>
                      <td>{new Date(att.date).toLocaleString()}</td>
                      <td>{att.courseSessionSchedule_ID || "N/A"}</td>
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
