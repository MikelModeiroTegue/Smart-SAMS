const { Attendance, Course, Student, CourseSession } = require('../models/model');

class AttendanceRepository {
  // Get all attendance data
  async getAllAttendance() {
    try {
      return await Attendance.findAll({
        include: [
          { model: Student },
          { model: CourseSession, include: [{ model: Course }] },
        ],
      });
    } catch (error) {
      throw new Error(`Failed to fetch attendance data: ${error.message}`);
    }
  }

  // Get attendance data for a specific course
  async getAttendanceByCourse(courseID) {
    try {
      const course = await Course.findOne({ 
        where: { course_ID: courseID } 
      });
      if (!course) {
        throw new Error('Course not found');
      }
      return await Attendance.findAll({
        include: [
          { model: Student },
          { 
            model: CourseSession, 
            where: { course_ID: courseID },
            include: [{ model: Course }],
          },
        ],
      });
    } catch (error) {
      throw new Error(`Failed to fetch attendance for course: ${error.message}`);
    }
  }
}

module.exports = new AttendanceRepository();