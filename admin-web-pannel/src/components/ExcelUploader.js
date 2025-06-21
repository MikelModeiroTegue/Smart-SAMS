import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ExcelUploader = () => {
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!file || !year || !semester) {
      setError("Please fill all fields (file, year, and semester).");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(worksheet);

        await axios.post("http://localhost:3000/api/admin/timetable", {
          year,
          semester,
          timetable: json,
        });
        await axios.post("http://localhost:3000/api/admin/timetable/load", {});
        alert("Timetable processed successfully.");
        navigate("/course-sessions");
      } catch (err) {
        setError(
          `Error processing timetable: ${err.response?.data?.error || err.message
          }`
        );
      } finally {
        setUploading(false);
      }
    };
    reader.onerror = () => {
      setError("Error reading file.");
      setUploading(false);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="ml-64 mt-10">
      <div className="upload-card bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-yellow-600">
          Import Timetable
        </h2>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="mb-4 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Year (Example: 2025)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
        />
        <input
          type="text"
          placeholder="Semester (Example: Second)"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {uploading ? "Uploading..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default ExcelUploader;
