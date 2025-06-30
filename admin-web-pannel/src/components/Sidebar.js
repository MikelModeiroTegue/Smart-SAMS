import React, { useState } from 'react';
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
  X
} from 'lucide-react';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState('/');

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

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 transition-all duration-300 ease-in-out z-50 ${
      isCollapsed ? 'w-20' : 'w-72'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
        <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-white font-bold text-xl">Admin Panel</h2>
              <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full font-medium">
                Administrator
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {links.map((link, index) => {
          const Icon = link.icon;
          const isActive = activeLink === link.path;
          
          return (
            <div
              key={link.path}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="animate-fade-in-up"
            >
              <button
                onClick={() => handleLinkClick(link.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full"></div>
                )}
                
                {/* Icon */}
                <div className={`flex-shrink-0 ${isActive ? 'text-blue-400' : ''} ${isCollapsed ? 'mx-auto' : ''}`}>
                  <Icon size={20} />
                </div>
                
                {/* Label */}
                {!isCollapsed && (
                  <>
                    <span className="font-medium text-sm flex-1 text-left">
                      {link.label}
                    </span>
                    <ChevronRight 
                      size={16} 
                      className={`transition-transform duration-200 ${
                        isActive ? 'rotate-90 text-blue-400' : 'group-hover:translate-x-1'
                      }`} 
                    />
                  </>
                )}
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
              </button>
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-20 top-1/2 -translate-y-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-slate-600 shadow-xl">
                  {link.label}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-600"></div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 p-4 rounded-xl border border-slate-600/30">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Admin User</p>
                <p className="text-slate-400 text-xs">Online</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}