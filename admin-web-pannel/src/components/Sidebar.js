// Sidebar.jsx
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
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
    <motion.div
      className="sidebar"
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="sidebar-header">
        <motion.h2
          className="sidebar-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          
          <span className="admin-badge">Admin</span>
        </motion.h2>
      </div>
      <nav className="sidebar-nav">
        {links.map((link, index) => (
          <motion.div
            key={link.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <span className="link-icon">{link.icon}</span>
              <span className="link-text">{link.label}</span>
              <span className="link-arrow">→</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>
    </motion.div>
  );
}
