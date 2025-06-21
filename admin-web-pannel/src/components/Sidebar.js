// Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUpload,
  FiCalendar,
  FiBook,
  FiUsers,
  FiUser,
  FiBarChart2,
  FiPieChart,
} from "react-icons/fi";

export default function Sidebar() {
  const links = [
    { label: "Dashboard", path: "/", icon: <FiHome /> },
    { label: "Import Timetable", path: "/import", icon: <FiUpload /> },
    {
      label: "Course Sessions",
      path: "/course-sessions",
      icon: <FiCalendar />,
    },
    { label: "Manage Courses", path: "/manage-courses", icon: <FiBook /> },
    { label: "Manage Students", path: "/manage-students", icon: <FiUsers /> },
    {
      label: "Manage Instructors",
      path: "/manage-instructors",
      icon: <FiUser />,
    },
    { label: "Analytics", path: "/analytics", icon: <FiBarChart2 /> },
    { label: "Statistics", path: "/statistics", icon: <FiPieChart /> },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Admin Panel</h2>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="link-icon">{link.icon}</span>
            <span className="link-text">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
