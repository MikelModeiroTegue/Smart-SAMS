import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="Home-title">Admin Panel</h2>
      <NavLink to="/import" className="block mb-4 hover:text-yellow-300">
        Import Timetable
      </NavLink>
    </div>
  );
}