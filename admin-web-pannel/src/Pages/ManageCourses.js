import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../components/Table";
import { useNavigate } from "react-router-dom";

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/admin/courses"
        );
        setCourses(response.data);
        setFilteredCourses(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    setFilteredCourses(
      courses.filter(
        (course) =>
          (!department || course.department === department) &&
          (!level || course.level === level)
      )
    );
  }, [department, level, courses]);

  const handleRowClick = (course) => {
    navigate(`/manage-courses/${course.course_ID}`);
  };

  const fetchCourseDetails = async (courseId) => {
    try {
      const [scheduleResponse, studentsResponse] = await Promise.all([
        axios.get(
          `http://localhost:3000/api/admin/schedules/course/:${courseId}`
        ),
        axios.get(
          `http://localhost:3000/api/admin/courses/:${courseId}/students`
        ),
      ]);
      setSchedules(scheduleResponse.data);
      setEnrolledStudents(studentsResponse.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignInstructor = async (instructorEmail) => {
    try {
      await axios.put("http://localhost:3000/api/admin/instructors/assign", {
        courseID: selectedCourse.course_ID,
        instructorEmail,
      });
      fetchCourseDetails(selectedCourse.course_ID);
    } catch (err) {
      console.error(err);
    }
  };

  if (selectedCourse) {
    return (
      <div className="main-content">
        <button
          onClick={() => setSelectedCourse(null)}
          className="btn btn-blue"
        >
          Back to Courses
        </button>

        <h2 className="page-header h2">
          Course Details: {selectedCourse.course_ID}
        </h2>

        <div className="form-group">
          <label htmlFor="instructor-email" className="mr-2">
            Instructor Email:
          </label>
          <input
            id="instructor-email"
            type="text"
            value={selectedCourse.instructorEmail || ""}
            onChange={(e) =>
              setSelectedCourse({
                ...selectedCourse,
                instructorEmail: e.target.value,
              })
            }
            className="filter-controls input"
          />
          <button
            onClick={() =>
              handleAssignInstructor(selectedCourse.instructorEmail)
            }
            className="btn btn-blue ml-2"
          >
            Assign Instructor
          </button>
        </div>

        <h3 className="page-header h3 mt-4">Schedules</h3>
        <div className="table-container mt-4">
          <Table
            headers={["Day", "Start Time", "End Time", "Venue"]}
            data={schedules.map((s) => ({
              Day: s.day,
              "Start Time": s.startTime,
              "End Time": s.endTime,
              Venue: s.vName,
            }))}
            onRowClick={async (schedule) => {
              const attendance = await axios.get(
                `http://localhost:3000/api/admin/attendance/course/:${selectedCourse.course_ID}`
              );
              console.log(attendance.data);
            }}
          />
        </div>

        <h3 className="page-header h3 mt-6">Enrolled Students</h3>
        <div className="stat-cards mt-4">
          {enrolledStudents.map((student) => (
            <div key={student.matricule} className="stat-card">
              <p>
                <strong>Matricule:</strong> {student.matricule}
              </p>
              <p>
                <strong>Name:</strong> {student.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <h2 className="page-header h2">Manage Courses</h2>

      <div className="filter-controls">
        <input
          type="text"
          placeholder="Filter by Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="filter-section input"
        />
        <input
          type="text"
          placeholder="Filter by Level"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="filter-section input"
        />
      </div>

      <div className="table-container mt-4">
        <Table
          headers={["Course ID", "Title", "Department", "Level"]}
          data={filteredCourses.map((course) => ({
            "Course ID": course.course_ID,
            Title: course.title,
            Department: course.department,
            Level: course.level,
          }))}
          onRowClick={handleRowClick}
        />
      </div>
    </div>
  );
}
