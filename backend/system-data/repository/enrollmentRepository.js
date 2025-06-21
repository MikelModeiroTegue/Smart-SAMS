const { Enrollment, Student, Course } = require("../models/model");

class EnrollmentRepository {
  // Check if a student is enrolled in a course
    async isStudentEnrolled(studentMatricule, courseID) {
        try {
        if (!studentMatricule || !courseID) {
            throw new Error("Missing student_matricule or course_ID");

        }
        const enrollment = await Enrollment.findOne({
            where: { student_matricule: studentMatricule, course_ID: courseID },
        });
        return enrollment;
        } catch (error) {
        throw new Error(`Failed to check enrollment: ${error.message}`);
        }
    }

    // Enroll a single student in a course
    async enrollStudent(studentMatricule, courseID) {
        try {
        if (!studentMatricule || !courseID) {
            throw new Error("Missing student_matricule or course_ID");
        }
        const student = await Student.findByPk(studentMatricule);
        if (!student) {
            throw new Error(`Student ${studentMatricule} not found`);
        }
        const course = await Course.findByPk(courseID);
        if (!course) {
            throw new Error(`Course ${courseID} not found`);
        }
        const [enrollment, created] = await Enrollment.upsert({
            student_matricule: studentMatricule,
            course_ID: courseID,
        });
        return {
            message: created
            ? "Student enrolled successfully"
            : "Student already enrolled",
            enrollment,
        };
        } catch (error) {
        throw new Error(`Failed to enroll student: ${error.message}`);
        }
    }
    }

    module.exports = new EnrollmentRepository();
