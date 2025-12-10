import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Upload,
  Calendar,
  BookOpen,
  Users,
  User,
  BarChart3,
  PieChart,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import "../css/sidebar.css";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const links = [
    { label: "Dashboard", path: "/", icon: Home },
    { label: "Import Timetable", path: "/import", icon: Upload },
    { label: "Course Sessions", path: "/course-sessions", icon: Calendar },
    { label: "Manage Courses", path: "/manage-courses", icon: BookOpen },
    { label: "Manage Students", path: "/manage-students", icon: Users },
    { label: "Manage Instructors", path: "/manage-instructors", icon: User },
    { label: "Analytics", path: "/analytics", icon: BarChart3 },
    { label: "Statistics", path: "/statistics", icon: PieChart },
  ];

  return (
    <motion.div
      className={`sidebar ${isCollapsed ? "collapsed" : ""}`}
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {/* Header */}
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo">
            <span>A</span>
          </div>
          {!isCollapsed && (
            <div className="header-content">
              <motion.h2
                className="sidebar-title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Admin Panel
              </motion.h2>
              <span className="admin-badge">Administrator</span>
            </div>
          )}
        </div>
        <button
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Navigation */}
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
              <span className="link-icon">{<link.icon size={20} />}</span>
              {!isCollapsed && (
                <>
                  <span className="link-text">{link.label}</span>
                  <ChevronRight size={16} className="link-arrow" />
                </>
              )}
              <span className="active-indicator"></span>
              <span className="hover-effect"></span>
            </NavLink>

            {/* Tooltip for collapsed state */}
            {isCollapsed && <div className="link-tooltip">{link.label}</div>}
          </motion.div>
        ))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">
              <User size={16} />
            </div>
            <div className="user-info">
              <p className="username">Admin User</p>
              <p className="status">Online</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
