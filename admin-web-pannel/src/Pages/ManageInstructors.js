import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../components/Table";
import EditForm from "../components/EditForm";

export default function ManageInstructors() {
    const [instructors, setInstructors] = useState([]);
    const [editingInstructor, setEditingInstructor] = useState(null);
    const [assignedCourses, setAssignedCourses] = useState([]);

    const fetchInstructors = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/api/admin/instructors"
            );
            setInstructors(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchInstructors();
    }, []);

    const handleEditClick = async (instructor) => {
        setEditingInstructor(instructor);
        await fetchAssignedCourses(instructor.email);
    };

    const fetchAssignedCourses = async (email) => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/admin/instructors/${email}/courses`
            );
            setAssignedCourses(response.data);
        } catch (err) {
            console.error(err);
            setAssignedCourses([]);
        }
    };

    if (editingInstructor) {
        return (
            <div className="main-content">
                <EditForm
                    item={editingInstructor}
                    fields={[
                        { name: "name", label: "Name" },
                        { name: "email", label: "Email" },
                        { name: "phoneNum", label: "Phone Number" },
                    ]}
                    onSave={async () => {
                        await fetchInstructors();
                        setEditingInstructor(null);
                        setAssignedCourses([]);
                    }}
                    onCancel={() => {
                        setEditingInstructor(null);
                        setAssignedCourses([]);
                    }}
                    apiEndpoint="http://localhost:3000/api/admin/instructors"
                />

                {assignedCourses.length > 0 ? (
                    <div className="stat-cards mt-4">
                        <h3 className="page-header h3">
                            Assigned Courses for {editingInstructor.name}
                        </h3>
                        <div className="table-container mt-4">
                            <Table
                                headers={["Course Code", "Course Name", "Level"]}
                                data={assignedCourses.map((course) => ({
                                    "Course Code": course.courseCode,
                                    "Course Name": course.courseName,
                                    Level: course.level || "N/A",
                                }))}
                            />
                        </div>
                    </div>
                ) : (
                    <p className="meta-info mt-4">
                        No assigned courses found for this instructor.
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="main-content">
            <h2 className="page-header h2">Manage Instructors</h2>
            <div className="table-container mt-4">
                <Table
                    headers={["Email", "Name", "Phone", "Actions"]}
                    data={instructors.map((instructor) => ({
                        Email: instructor.email,
                        Name: instructor.name,
                        Phone: instructor.phoneNum,
                        Actions: (
                            <button
                                onClick={() => handleEditClick(instructor)}
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
