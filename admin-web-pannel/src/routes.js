import { Routes, Route } from "react-router-dom";
import ImportTimetable from "../src/Pages/ImportTimetable";
import CourseSessions from "../src/Pages/CourseSessions";
import ManageCourses from "../src/Pages/ManageCourses";
import ManageStudents from "../src/Pages/ManageStudents";
import ManageInstructors from "../src/Pages/ManageInstructors";
import Analytics from "../src/Pages/Analytics";
import Statistics from "../src/Pages/Statistics";
import Sidebar from "./components/Sidebar";
import Dashboard from "../src/Pages/Dashboard";

export default function AppRoutes() {
  return (
    <>
      <Sidebar />
      <div className="ml-64 p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/import" element={<ImportTimetable />} />
          <Route path="/course-sessions" element={<CourseSessions />} />
          <Route path="/manage-courses" element={<ManageCourses />} />
          <Route path="/manage-students" element={<ManageStudents />} />
          <Route path="/manage-instructors" element={<ManageInstructors />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </div>
    </>
  );
}
