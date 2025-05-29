import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const ExcelUploader = () => {
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async () => {
    if (!file || !year || !semester) return alert('Please fill all fields.');

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet);

      try {
        await axios.post('http://localhost:4000/api/timetable', {
          year,
          semester,
          timetable: json,
        });
        alert('Timetable saved successfully.');
      } catch (err) {
        alert('Error saving timetable.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="ml-64">
      <div className="upload-card">
        <h2> Import Timetable</h2>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <input type="text" placeholder="Year (Example: 2025)" value={year} onChange={(e) => setYear(e.target.value)} />
        <input type="text" placeholder="Semester (Example: Second)" value={semester} onChange={(e) => setSemester(e.target.value)} />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default ExcelUploader;
