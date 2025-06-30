import React, { useState, useEffect, useCallback } from "react";
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
  UserCheck, 
  Calendar,
  TrendingUp,
  Activity,
  Clock,
  Target,
  BarChart3,
  Zap
} from "lucide-react";

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

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API calls with mock data
    setTimeout(() => {
      setMetrics({
        totalStudents: { value: 1250, loading: false, error: null },
        totalCourses: { value: 45, loading: false, error: null },
        totalInstructors: { value: 28, loading: false, error: null },
        totalSessions: { value: 180, loading: false, error: null },
        overallAttendanceRate: { value: 87.5, loading: false, error: null },
        recentAttendance: { 
          value: [
            { student_matricule: "STU001", courseSession: { course: { name: "Mathematics" } }, date: new Date(), courseSessionSchedule_ID: "SCH001" },
            { student_matricule: "STU002", courseSession: { course: { name: "Physics" } }, date: new Date(), courseSessionSchedule_ID: "SCH002" },
            { student_matricule: "STU003", courseSession: { course: { name: "Chemistry" } }, date: new Date(), courseSessionSchedule_ID: "SCH003" },
            { student_matricule: "STU004", courseSession: { course: { name: "Biology" } }, date: new Date(), courseSessionSchedule_ID: "SCH004" },
            { student_matricule: "STU005", courseSession: { course: { name: "English" } }, date: new Date(), courseSessionSchedule_ID: "SCH005" },
          ], 
          loading: false, 
          error: null 
        },
        weeklyStats: { 
          value: [
            { week: "Week 1", total: 120, averageRate: 85 },
            { week: "Week 2", total: 135, averageRate: 88 },
            { week: "Week 3", total: 142, averageRate: 90 },
            { week: "Week 4", total: 138, averageRate: 87 },
            { week: "Week 5", total: 145, averageRate: 92 },
            { week: "Week 6", total: 150, averageRate: 89 },
          ], 
          loading: false, 
          error: null 
        },
        attendanceRates: { 
          value: [
            { courseName: "Mathematics", rate: 92 },
            { courseName: "Physics", rate: 85 },
            { courseName: "Chemistry", rate: 88 },
            { courseName: "Biology", rate: 90 },
            { courseName: "English", rate: 87 },
            { courseName: "History", rate: 83 },
          ], 
          loading: false, 
          error: null 
        },
      });
    }, 1000);
  }, []);

  // Prepare data for charts
  const summaryData = [
    { name: "Students", value: metrics.totalStudents.value },
    { name: "Courses", value: metrics.totalCourses.value },
    { name: "Instructors", value: metrics.totalInstructors.value },
    { name: "Sessions", value: metrics.totalSessions.value },
  ];

  const StatCard = ({ title, value, icon: Icon, color, loading, trend }) => (
    <div className="bg-white rounded-2xl shadow-lg border-0 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : (
              typeof value === 'number' ? value.toLocaleString() : value
            )}
          </p>
          {trend && (
            <p className="text-sm text-green-600 font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-4 rounded-xl ${color} shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, children, className = "", icon: Icon }) => (
    <div className={`bg-white rounded-2xl shadow-lg border-0 p-6 hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          {Icon && <Icon className="w-6 h-6 mr-3 text-gray-600" />}
          {title}
        </h3>
      </div>
      {children}
    </div>
  );

  const isLoading = Object.values(metrics).some((m) => m.loading);
  const hasError = Object.values(metrics).some((m) => m.error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Dashboard Analytics
          </h1>
          <p className="text-gray-600 text-lg">Real-time insights into your educational system performance</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
              <div className="animate-ping absolute top-0 left-0 rounded-full h-16 w-16 border-4 border-blue-400 opacity-30"></div>
            </div>
            <span className="mt-4 text-gray-600 font-medium">Loading dashboard data...</span>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg shadow-sm">
            <p className="text-red-800 font-semibold">Error loading data:</p>
            <p className="text-red-600 text-sm mt-1">
              {Object.values(metrics)
                .filter((m) => m.error)
                .map((m, i, arr) => `${m.error}${i < arr.length - 1 ? ", " : ""}`)}
            </p>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Students"
                value={metrics.totalStudents.value}
                icon={Users}
                color="bg-gradient-to-r from-blue-500 to-blue-600"
                loading={metrics.totalStudents.loading}
                trend="+8.2%"
              />
              <StatCard
                title="Total Courses"
                value={metrics.totalCourses.value}
                icon={BookOpen}
                color="bg-gradient-to-r from-green-500 to-green-600"
                loading={metrics.totalCourses.loading}
                trend="+3.1%"
              />
              <StatCard
                title="Instructors"
                value={metrics.totalInstructors.value}
                icon={UserCheck}
                color="bg-gradient-to-r from-yellow-500 to-orange-500"
                loading={metrics.totalInstructors.loading}
                trend="+12.5%"
              />
              <StatCard
                title="Sessions"
                value={metrics.totalSessions.value}
                icon={Calendar}
                color="bg-gradient-to-r from-red-500 to-pink-500"
                loading={metrics.totalSessions.loading}
                trend="+5.7%"
              />
            </div>

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Attendance Rate Gauge - Featured */}
              <ChartCard title="Overall Attendance Rate" icon={Target} className="lg:col-span-1">
                <div className="h-80 flex flex-col items-center justify-center">
                  <ResponsiveContainer width="100%" height="70%">
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
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#e5e7eb" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {metrics.overallAttendanceRate.value.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-500 font-medium">Attendance Rate</div>
                  </div>
                </div>
              </ChartCard>

              {/* System Overview */}
              <ChartCard title="System Overview" icon={Zap} className="lg:col-span-2">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={summaryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
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
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>

            {/* Quick Stats Cards */}
            <ChartCard title="Performance Metrics" icon={Activity} className="mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center">
                    <TrendingUp className="w-8 h-8 text-blue-600 mr-4" />
                    <div>
                      <div className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Weekly Growth</div>
                      <div className="text-2xl font-bold text-blue-900">+12%</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center">
                    <Activity className="w-8 h-8 text-green-600 mr-4" />
                    <div>
                      <div className="text-sm font-semibold text-green-700 uppercase tracking-wide">Active Sessions</div>
                      <div className="text-2xl font-bold text-green-900">24</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
                  <div className="flex items-center">
                    <Clock className="w-8 h-8 text-yellow-600 mr-4" />
                    <div>
                      <div className="text-sm font-semibold text-yellow-700 uppercase tracking-wide">Avg. Duration</div>
                      <div className="text-2xl font-bold text-yellow-900">2.5h</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                  <div className="flex items-center">
                    <Target className="w-8 h-8 text-purple-600 mr-4" />
                    <div>
                      <div className="text-sm font-semibold text-purple-700 uppercase tracking-wide">Target Rate</div>
                      <div className="text-2xl font-bold text-purple-900">90%</div>
                    </div>
                  </div>
                </div>
              </div>
            </ChartCard>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
              {/* Weekly Attendance Trend */}
              <ChartCard title="Weekly Attendance Trend" icon={TrendingUp}>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={metrics.weeklyStats.value}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="week" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        activeDot={{ r: 6, fill: '#3b82f6' }}
                        name="Total Attendance"
                      />
                      <Line
                        type="monotone"
                        dataKey="averageRate"
                        stroke="#10b981"
                        strokeWidth={3}
                        activeDot={{ r: 6, fill: '#10b981' }}
                        name="Average Rate (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              {/* Course-wise Attendance */}
              <ChartCard title="Course-wise Attendance Rates" icon={BarChart3}>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={metrics.attendanceRates.value}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="courseName" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="rate"
                        fill="url(#barGradient)"
                        name="Attendance Rate (%)"
                        radius={[6, 6, 0, 0]}
                      />
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>

            {/* Recent Attendance Table */}
            <ChartCard title="Recent Attendance Records" className="w-full">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Student ID</th>
                      <th className="px-6 py-4 font-semibold">Course</th>
                      <th className="px-6 py-4 font-semibold">Date & Time</th>
                      <th className="px-6 py-4 font-semibold">Session ID</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {metrics.recentAttendance.value.map((att, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {att.student_matricule || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-gray-700 font-medium">
                          {att.courseSession?.course?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(att.date).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                          {att.courseSessionSchedule_ID || "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                            Present
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          </>
        )}
      </div>
    </div>
  );
}