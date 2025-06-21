import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalStudents: { value: 0, loading: true, error: null },
    totalCourses: { value: 0, loading: true, error: null },
    totalInstructors: { value: 0, loading: true, error: null },
    totalSessions: { value: 0, loading: true, error: null },
    overallAttendanceRate: { value: "N/A", loading: true, error: null },
    recentAttendance: { value: [], loading: true, error: null },
    weeklyStats: {
      value: { total: "N/A", averageRate: "N/A" },
      loading: true,
      error: null,
    },
  });

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
      let value;

      switch (key) {
        case "totalStudents":
        case "totalCourses":
        case "totalInstructors":
        case "totalSessions":
          value = response.data.length;
          break;
        case "overallAttendanceRate":
          value =
            response.data.length > 0
              ? (
                  response.data.reduce((sum, item) => sum + item.rate, 0) /
                  response.data.length
                ).toFixed(2)
              : "N/A";
          break;
        case "recentAttendance":
          value = response.data
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
          break;
        case "weeklyStats":
          const currentWeekNum = getCurrentWeek();
          value = response.data.find((stat) => {
            const parts = stat.week.split(" ");
            return parseInt(parts[1]) === currentWeekNum;
          }) || { total: "N/A", averageRate: "N/A" };
          break;
        default:
          value = response.data;
      }

      setMetrics((prev) => ({
        ...prev,
        [key]: { value, loading: false, error: null },
      }));
    } catch (err) {
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
  }, [fetchData]);

  return (
    <div className="dashboard-screen">
      <h2 className="dashboard-title">Dashboard</h2>

      {Object.values(metrics).some((m) => m.loading) && (
        <p className="dashboard-status">Loading...</p>
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
          <div className="dashboard-card blue">
            <h3>Total Students</h3>
            <p>{metrics.totalStudents.value}</p>
          </div>

          <div className="dashboard-card green">
            <h3>Total Courses</h3>
            <p>{metrics.totalCourses.value}</p>
          </div>

          <div className="dashboard-card yellow">
            <h3>Total Instructors</h3>
            <p>{metrics.totalInstructors.value}</p>
          </div>

          <div className="dashboard-card purple">
            <h3>Total Sessions</h3>
            <p>{metrics.totalSessions.value}</p>
          </div>

          <div className="dashboard-card teal">
            <h3>Overall Attendance Rate</h3>
            <p>{metrics.overallAttendanceRate.value}%</p>
          </div>

          <div className="dashboard-card indigo wide">
            <h3>Current Week Stats</h3>
            <p>Total: {metrics.weeklyStats.value.total}</p>
            <p>Average Rate: {metrics.weeklyStats.value.averageRate}%</p>
          </div>

          <div className="dashboard-card red wide">
            <h3>Recent Attendance</h3>
            <ul className="attendance-list">
              {metrics.recentAttendance.value.map((att, index) => (
                <li key={index}>
                  {att.student_matricule || "N/A"} —{" "}
                  {new Date(att.date).toLocaleString()} —{" "}
                  {att.courseSessionSchedule_ID || "N/A"}
                </li>
              ))}
            </ul>
          </div>

          <div className="dashboard-actions">
            <a href="/course-sessions" className="dashboard-button blue">
              View Sessions
            </a>
            <a href="/manage-courses" className="dashboard-button green">
              Manage Courses
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
