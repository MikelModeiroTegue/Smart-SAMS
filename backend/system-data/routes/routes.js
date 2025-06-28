const express = require("express");
const router = express.Router();
const instructorRepository = require("../repository/instructorRepository");
const courseRepository = require("../repository/courseRepository");
const courseSessionRepository = require("../repository/courseSessionRepository");
const studentRepository = require("../repository/studentRepository");
const attendanceRepository = require("../repository/attendanceRepository");
const enrollmentRepository = require("../repository/enrollmentRepository");
const timetableService = require("../../services/timetableService");
const courseAssignmentRepository = require("../repository/courseAssignmentRepository");

const fs = require("fs");

// Middleware for admin authentication (placeholder)
// Implement admin authentication logic here
// const adminAuth = (req, res, next) => { /* Add logic */ next(); };

// Edit assigned instructor
router.put("/instructors/assign", async (req, res) => {
  try {
    const { courseID, instructorEmail } = req.body;
    const result = await instructorRepository.editAssignedInstructor(
      courseID,
      instructorEmail
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// get Instructor assigned to a course 
router.get("/instructors/assigned", async (req, res) => {
  try {
    const { courseID } = req.query;
    if (!courseID) {
      return res.status(400).json({ error: "Missing course ID" });
    }
    const coursesAssigned = await courseAssignmentRepository.getAssignmentsByCourse(
      courseID
    );
    console.log("Courses assigned:", coursesAssigned);
    res.status(200).json(coursesAssigned);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
 })

// Edit course schedule
router.put("/schedules/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { courseID, day, startTime, endTime, vName } = req.body;
    const result = await courseSessionRepository.editCourseSchedule(sessionId, {
      courseID,
      day,
      startTime,
      endTime,
      vName,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all instructors
router.get("/instructors", async (req, res) => {
  try {
    const instructors = await instructorRepository.getAllInstructors();
    res.status(200).json(instructors);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all students
router.get("/students", async (req, res) => {
  try {
    const students = await studentRepository.getAllStudents();
    res.status(200).json(students);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all courses
router.get("/courses", async (req, res) => {
  try {
    const courses = await courseRepository.getAllCourses();
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get course schedules per course
router.get("/schedules/course/:courseID", async (req, res) => {
  try {
    const { courseID } = req.params;
    const schedules = await courseSessionRepository.getCourseSchedules(
      courseID
    );
    res.status(200).json(schedules);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all course schedules
router.get("/schedules", async (req, res) => {
  try {
    const schedules = await courseSessionRepository.getAllCourseSchedules();
    res.status(200).json(schedules);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all students enrolled per course
router.get("/courses/:courseID/students", async (req, res) => {
  try {
    const { courseID } = req.params;
    const students = await courseRepository.getStudentsEnrolled(courseID);
    res.status(200).json(students);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update student
router.put("/students/:matricule", async (req, res) => {
  try {
    const { matricule } = req.params;
    const { name, phoneNum, email, department, deviceInfo } = req.body;
    const result = await studentRepository.updateStudent(matricule, {
      name,
      phoneNum,
      email,
      department,
      deviceInfo,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete student
router.delete("/students/:matricule", async (req, res) => {
  try {
    const { matricule } = req.params;
    const result = await studentRepository.deleteStudent(matricule);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete instructor
router.delete("/instructors/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const result = await instructorRepository.deleteInstructor(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all attendance data
router.get("/attendance", async (req, res) => {
  try {
    const attendance = await attendanceRepository.getAllAttendance();
    res.status(200).json(attendance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get attendance data per course
router.get("/attendance/course/:courseID", async (req, res) => {
  try {
    const { courseID } = req.params;
    const attendance = await attendanceRepository.getAttendanceByCourse(
      courseID
    );
    res.status(200).json(attendance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get student matricule by email
router.post("/student/matricule", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }
    const student = await studentRepository.getStudentByEmail(email);
    console.log("Student got:", student)
    res.status(200).json({ matricule: student.matricule });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get course sessions by level, department, and day
router.get("/sessions", async (req, res) => {
  try {
    const { level, department } = req.query;
    console.log("Received query:", { level, department });

    if (!level || !department) {
      return res.status(400).json({ error: "Missing level or department" });
    }
    const now = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDay = days[now.getDay()];
    if (
      !["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].includes(
        currentDay
      )
    ) {
      return res
        .status(400)
        .json({ error: "No classes scheduled on weekends" });
    }
    const sessions =
      await courseSessionRepository.getSessionsByLevelDepartmentAndDay(
        level,
        department,
        currentDay
      );
    res.status(200).json(sessions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Check enrollment status
router.post("/enrollment/check", async (req, res) => {
  try {
    const { studentMatricule, courseID } = req.body;
    if (!studentMatricule || !courseID) {
      return res
        .status(400)
        .json({ error: "Missing student_matricule or course_ID" });
    }
    const isEnrolled = await enrollmentRepository.isStudentEnrolled(
      studentMatricule,
      courseID
    );
    console.log("Enrollment status:", isEnrolled);
    res.status(200).json({ isEnrolled });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Enroll student
router.post("/enrollment", async (req, res) => {
  try {
    const { studentMatricule, courseID } = req.body;
    if (!studentMatricule || !courseID) {
      return res
        .status(400)
        .json({ error: "Missing student_matricule or course_ID" });
    }
    const result = await enrollmentRepository.enrollStudent(
      studentMatricule,
      courseID
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get venue geolocations
router.get("/venue/:vName/geolocations", async (req, res) => {
  try {
    const { vName } = req.params;
    if (!vName) {
      return res.status(400).json({ error: "Missing venue name" });
    }
    const geolocations = await courseSessionRepository.getVenueGeolocations(
      vName
    );
    res.status(200).json({ geolocations });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Initialize the system timetable
router.post("/timetable", (req, res) => {
  try {
    const { year, semester, timetable } = req.body;
    const content = { year, semester, timetable };
    fs.writeFileSync(
      "../backend/system-data/timetable.json",
      JSON.stringify(content, null, 2)
    );
    res.status(200).json({ message: "Timetable saved." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Load timetable
router.post("/timetable/load", async (req, res) => {
  try {
    const result = await timetableService.loadTimetable();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/attendance/store", async (req, res) => {
  console.log("=== ATTENDANCE STORE REQUEST RECEIVED ===");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Request Headers:", req.headers);
  console.log("Request Body:", req.body);
  console.log("Request Method:", req.method);
  console.log("Request URL:", req.url);
  
  try {
      const {
          courseSessionSchedule_ID,
          student_matricule,
          blockchainTxID,
          date,
      } = req.body;

      console.log("Extracted parameters:", {
          courseSessionSchedule_ID,
          student_matricule,
          blockchainTxID,
          date
      });

      // Validate required fields
      if (!courseSessionSchedule_ID || !student_matricule || !blockchainTxID) {
          console.log(" Missing required fields");
          return res.status(400).json({ 
              success: false, 
              error: "Missing required fields",
              received: {
                  courseSessionSchedule_ID: !!courseSessionSchedule_ID,
                  student_matricule: !!student_matricule,
                  blockchainTxID: !!blockchainTxID
              }
          });
      }

      console.log(" All required fields present, calling repository...");
      
      const attendance = await attendanceRepository.storeAttendance({
          courseSessionSchedule_ID,
          student_matricule,
          blockchainTxID,
          date,
      });

      console.log(" Repository call successful:", attendance);
      
      res.status(200).json({ success: true, attendance });
      
  } catch (error) {
      console.log(" Error in attendance store:", error.message);
      console.log("Error stack:", error.stack);
      
      res.status(400).json({ 
          success: false, 
          error: error.message,
          timestamp: new Date().toISOString()
      });
  }
});

router.get("/analytics/attendance-rate", async (req, res) => {
  try {
    // Logic to calculate attendance rate per course
    const rates = await attendanceRepository.getAttendanceRates();
    res.status(200).json(rates);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/statistics/weekly-attendance", async (req, res) => {
  try {
    const stats = await attendanceRepository.getWeeklyAttendance();
    res.status(200).json(stats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
