import { Routes, Route } from 'react-router-dom';
import ImportTimetable from '../src/Pages/ImportTimetable';
import Sidebar from './components/Sidebar';

export default function AppRoutes() {
  return (
    <>
      <Sidebar />
      <Routes>
        <Route path="/import" element={<ImportTimetable />} />
        {/* Add more routes here */}
      </Routes>
    </>
  );
}