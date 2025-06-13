const express = require('express');
const router = express.Router();
const instructorRepository = require('../repository/instructorRepository');
const courseRepository = require('../repository/courseRepository');
const courseSessionRepository = require('../repository/courseSessionRepository');
const studentRepository = require('../repository/studentRepository');
const attendanceRepository = require('../repository/attendanceRepository');
const timetableService = require('../../services/timetableService');

// Middleware for admin authentication (placeholder)
// Implement admin authentication logic 


// Edit assigned instructor
router.put('/instructors/assign', async (req, res) => {
  try {
    const { courseCode, semesterPeriod, instructorEmail } = req.body;
    const result = await instructorRepository.editAssignedInstructor(courseCode, semesterPeriod, instructorEmail);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Edit course schedule
router.put('/schedules/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { courseCode, semesterPeriod, day, startTime, endTime, vName } = req.body;
    const result = await courseSessionRepository.editCourseSchedule(sessionId, {
      courseCode,
      semesterPeriod,
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
router.get('/instructors', async (req, res) => {
  try {
    const instructors = await instructorRepository.getAllInstructors();
    res.status(200).json(instructors);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all students
router.get('/students', async (req, res) => {
  try {
    const students = await studentRepository.getAllStudents();
    res.status(200).json(students);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await courseRepository.getAllCourses();
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get course schedules per course
router.get('/schedules/course/:courseCode/:semesterPeriod', async (req, res) => {
  try {
    const { courseCode, semesterPeriod } = req.params;
    const schedules = await courseSessionRepository.getCourseSchedules(courseCode, semesterPeriod);
    res.status(200).json(schedules);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all course schedules
router.get('/schedules', async (req, res) => {
  try {
    const schedules = await courseSessionRepository.getAllCourseSchedules();
    res.status(200).json(schedules);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all students enrolled per course
router.get('/courses/:courseCode/:semesterPeriod/students', async (req, res) => {
  try {
    const { courseCode, semesterPeriod } = req.params;
    const students = await courseRepository.getStudentsEnrolled(courseCode, semesterPeriod);
    res.status(200).json(students);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update student
router.put('/students/:matricule', async (req, res) => {
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
router.delete('/students/:matricule', async (req, res) => {
  try {
    const { matricule } = req.params;
    const result = await studentRepository.deleteStudent(matricule);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete instructor
router.delete('/instructors/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const result = await instructorRepository.deleteInstructor(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all attendance data
router.get('/attendance', async (req, res) => {
  try {
    const attendance = await attendanceRepository.getAllAttendance();
    res.status(200).json(attendance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get attendance data per course
router.get('/attendance/course/:courseCode/:semesterPeriod', async (req, res) => {
  try {
    const { courseCode, semesterPeriod } = req.params;
    const attendance = await attendanceRepository.getAttendanceByCourse(courseCode, semesterPeriod);
    res.status(200).json(attendance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//  Initialize the system timetable 
router.post('/timetable', (req, res) => {
    const { year, semester, timetable } = req.body;
    const content = {
      year,
      semester,
      timetable,
    };
    fs.writeFileSync('../system-data/timetable.json', JSON.stringify(content, null, 2));
    res.status(200).send({ message: 'Timetable saved.' });
});
  
router.post('/timetable/load', async (req, res) => {
    try {
      const result = await timetableService.loadTimetable();
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

module.exports = router;