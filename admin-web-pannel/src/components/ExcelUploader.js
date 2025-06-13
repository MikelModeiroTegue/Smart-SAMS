import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const ExcelUploader = () => {
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async () => {
    if (!file || !year || !semester) {
      alert('Please fill all fields.');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(worksheet);

        await axios.post('http://localhost:3000/api/admin/timetable', {
          year,
          semester,
          timetable: json,
        });
        alert('Timetable saved successfully.');

        await axios.post('http://localhost:3000/api/admin/timetable/load', {});
        alert('Timetable loaded successfully.');
      } catch (err) {
        console.error('Error:', err.response?.data?.error || err.message);
        alert(`Error processing timetable: ${err.response?.data?.error || err.message}`);
      } finally {
        setUploading(false);
      }
    };
    reader.onerror = () => {
      alert('Error reading file.');
      setUploading(false);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="ml-64">
      <div className="upload-card">
        <h2>Import Timetable</h2>
        <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
        <input
          type="text"
          placeholder="Year (Example: 2025)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <input
          type="text"
          placeholder="Semester (Example: Second)"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        />
        <button onClick={handleSubmit} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default ExcelUploader;