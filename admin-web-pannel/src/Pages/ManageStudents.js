import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../components/Table";
import EditForm from "../components/EditForm";

export default function ManageStudents() {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [department, setDepartment] = useState("");
    const [level, setLevel] = useState("");
    const [editingStudent, setEditingStudent] = useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    const fetchStudents = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/admin/students");
            setStudents(response.data);
            setFilteredStudents(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        setFilteredStudents(
            students.filter(
                (student) =>
                    (!department || student.department === department) &&
                    (!level || student.level === level)
            )
        );
    }, [department, level, students]);

    const handleEditClick = async (student) => {
        setEditingStudent(student);
        await fetchEnrolledCourses(student.matricule);
    };

    const fetchEnrolledCourses = async (matricule) => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/admin/students/${matricule}/courses`
            );
            setEnrolledCourses(response.data);
        } catch (err) {
            console.error(err);
            setEnrolledCourses([]);
        }
    };

    if (editingStudent) {
        return (
            <div className="main-content">
                <EditForm
                    item={editingStudent}
                    fields={[
                        { name: "name", label: "Name" },
                        { name: "phoneNum", label: "Phone Number" },
                        { name: "email", label: "Email" },
                        { name: "department", label: "Department" },
                        { name: "level", label: "Level" },
                    ]}
                    onSave={async () => {
                        await fetchStudents();
                        setEditingStudent(null);
                        setEnrolledCourses([]);
                    }}
                    onCancel={() => {
                        setEditingStudent(null);
                        setEnrolledCourses([]);
                    }}
                    apiEndpoint="http://localhost:3000/api/admin/students"
                />

                {enrolledCourses.length > 0 ? (
                    <div className="stat-cards mt-4">
                        <h3 className="page-header h3">
                            Enrolled Courses for {editingStudent.name}
                        </h3>
                        <div className="table-container mt-4">
                            <Table
                                headers={["Course Code", "Course Name", "Instructor"]}
                                data={enrolledCourses.map((course) => ({
                                    "Course Code": course.courseCode,
                                    "Course Name": course.courseName,
                                    Instructor: course.instructor || "N/A",
                                }))}
                            />
                        </div>
                    </div>
                ) : (
                    <p className="meta-info mt-4">No enrolled courses found for this student.</p>
                )}
            </div>
        );
    }

    return (
        <div className="main-content">
            <h2 className="page-header h2">Manage Students</h2>
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
                    headers={["Matricule", "Name", "Email", "Department", "Level", "Actions"]}
                    data={filteredStudents.map((student) => ({
                        Matricule: student.matricule,
                        Name: student.name,
                        Email: student.email,
                        Department: student.department,
                        Level: student.level,
                        Actions: (
                            <button
                                onClick={() => handleEditClick(student)}
                                className="btn btn-blue"
                            >
                                Edit
                            </button>
                        ),
                    }))}
                />
            </div>
        </div>
    );
}