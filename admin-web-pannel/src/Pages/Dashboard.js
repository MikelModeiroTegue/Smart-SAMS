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
import {
  Users,
  BookOpen,
  User,
  Calendar,
  Clock,
  ArrowUpRight,
  AlertCircle,
  Loader2,
  ChevronRight,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart2,
  LineChart as LineChartIcon,
} from "lucide-react";
import "../css/dashboard.css"

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

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

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
    {
      name: "Students",
      value: metrics.totalStudents.value,
      icon: <Users size={16} />,
    },
    {
      name: "Courses",
      value: metrics.totalCourses.value,
      icon: <BookOpen size={16} />,
    },
    {
      name: "Instructors",
      value: metrics.totalInstructors.value,
      icon: <User size={16} />,
    },
    {
      name: "Sessions",
      value: metrics.totalSessions.value,
      icon: <Calendar size={16} />,
    },
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
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <TrendingUp size={24} className="dashboard-title-icon" />
          Dashboard Analytics
        </h1>
        <div className="dashboard-subtitle">
          Overview of your institution's performance metrics
        </div>
      </div>

      {Object.values(metrics).some((m) => m.loading) && (
        <div className="dashboard-loading">
          <Loader2 size={20} className="animate-spin" />
          <span>Loading dashboard data...</span>
        </div>
      )}

      {Object.values(metrics).some((m) => m.error) && (
        <div className="dashboard-error">
          <AlertCircle size={20} />
          <span>
            {Object.values(metrics)
              .filter((m) => m.error)
              .map(
                (m, i, arr) => `${m.error}${i < arr.length - 1 ? ", " : ""}`
              )}
          </span>
        </div>
      )}

      {!Object.values(metrics).some((m) => m.loading || m.error) && (
        <>
          {/* Summary Cards */}
          <div className="metrics-grid">
            {summaryData.map((metric, index) => (
              <div key={metric.name} className="metric-card">
                <div
                  className="metric-icon"
                  style={{ backgroundColor: COLORS[index] + "20" }}
                >
                  {metric.icon}
                </div>
                <div className="metric-content">
                  <div className="metric-value">{metric.value}</div>
                  <div className="metric-label">{metric.name}</div>
                </div>
                <div className="metric-trend">
                  <ArrowUpRight size={16} />
                  <span>+2.5%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Main Dashboard Content */}
          <div className="dashboard-grid">
            {/* Attendance Rate Gauge */}
            <div className="dashboard-card">
              <div className="card-header">
                <PieChartIcon size={18} />
                <h3>Overall Attendance Rate</h3>
              </div>
              <div className="chart-container">
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
                      <Cell fill="#10b981" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="attendance-rate-text"
                    >
                      {metrics.overallAttendanceRate.value.toFixed(1)}%
                    </text>
                    <Tooltip
                      formatter={(value) => [
                        `${value}%`,
                        value === metrics.overallAttendanceRate.value
                          ? "Present"
                          : "Absent",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="card-footer">
                <span>Weekly change: +3.2%</span>
                <ChevronRight size={16} />
              </div>
            </div>

            {/* Summary Pie Chart */}
            <div className="dashboard-card">
              <div className="card-header">
                <PieChartIcon size={18} />
                <h3>System Overview</h3>
              </div>
              <div className="chart-container">
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
                    <Tooltip formatter={(value) => [`${value}`, "Count"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weekly Attendance Trend */}
            <div className="dashboard-card wide">
              <div className="card-header">
                <LineChartIcon size={18} />
                <h3>Weekly Attendance Trend</h3>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={metrics.weeklyStats.value}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="week"
                      stroke="#64748b"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#6366f1"
                      strokeWidth={2}
                      activeDot={{ r: 8, fill: "#6366f1" }}
                      name="Total Attendance"
                    />
                    <Line
                      type="monotone"
                      dataKey="averageRate"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Average Rate (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Course-wise Attendance */}
            <div className="dashboard-card wide">
              <div className="card-header">
                <BarChart2 size={18} />
                <h3>Course-wise Attendance Rates</h3>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={metrics.attendanceRates.value}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="courseName"
                      stroke="#64748b"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="rate"
                      fill="#6366f1"
                      name="Attendance Rate (%)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Attendance Table */}
            <div className="dashboard-card wide">
              <div className="card-header">
                <Clock size={18} />
                <h3>Recent Attendance Records</h3>
              </div>
              <div className="table-container">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Course</th>
                      <th>Date</th>
                      <th>Session</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.recentAttendance.value.map((att, index) => (
                      <tr key={index}>
                        <td>
                          <div className="student-cell">
                            <div className="student-avatar">
                              {att.student_matricule?.charAt(0) || "S"}
                            </div>
                            {att.student_matricule || "N/A"}
                          </div>
                        </td>
                        <td>{att.courseSession?.course?.name || "N/A"}</td>
                        <td>{new Date(att.date).toLocaleDateString()}</td>
                        <td>{att.courseSessionSchedule_ID || "N/A"}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              "present" 
                            }`}
                          >
                            {"Present"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card-footer">
                <span>
                  Showing 5 of {metrics.recentAttendance.value.length} records
                </span>
                <button className="view-all-button">
                  View All <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
