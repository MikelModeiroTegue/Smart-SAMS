const {
  Attendance,
  Course,
  Student,
  CourseSession,
} = require("../models/model");

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
      const course = await Course.findOne({ where: { course_ID: courseID } });
      if (!course) {
        throw new Error("Course not found");
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
      throw new Error(
        `Failed to fetch attendance for course: ${error.message}`
      );
    }
  }

  // Store attendance record
  async storeAttendance({
    courseSessionSchedule_ID,
    student_matricule,
    blockchainTxID,
    date,
  }) {
    try {
      const attendance = await Attendance.create({
        courseSessionSchedule_ID,
        student_matricule,
        blockchainTxID,
        date,
      });
      return attendance;
    } catch (error) {
      throw new Error(`Failed to store attendance: ${error.message}`);
    }
  }

  // Get attendance rates per course
  async getAttendanceRates() {
    try {
      const courses = await Course.findAll({
        include: [
          {
            model: CourseSession,
            attributes: ["ID"],
          },
          {
            model: Enrollment,
            attributes: ["student_matricule"],
            include: [{ model: Student }],
          },
        ],
      });

      const rates = await Promise.all(
        courses.map(async (course) => {
          const totalSessions = course.CourseSessions.length;
          const enrolledStudents = course.Enrollments.length;
          if (totalSessions === 0 || enrolledStudents === 0)
            return { courseID: course.course_ID, rate: 0 };

          const attendanceRecords = await Attendance.findAll({
            where: {
              courseSessionSchedule_ID: course.CourseSessions.map((s) => s.ID),
            },
            include: [{ model: Student }],
          });
          const totalPossibleAttendance = totalSessions * enrolledStudents;
          const actualAttendance = attendanceRecords.length;
          const rate = (actualAttendance / totalPossibleAttendance) * 100;

          return { courseID: course.course_ID, rate: Number(rate.toFixed(2)) };
        })
      );

      return rates;
    } catch (error) {
      throw new Error(`Failed to calculate attendance rates: ${error.message}`);
    }
  }

  // Get weekly attendance statistics
  async getWeeklyAttendance() {
    try {
      const attendanceRecords = await Attendance.findAll({
        attributes: [
          [sequelize.fn("WEEK", sequelize.col("date")), "week"],
          [sequelize.fn("COUNT", sequelize.col("id")), "total"],
        ],
        group: [sequelize.fn("WEEK", sequelize.col("date"))],
        include: [{ model: CourseSession, include: [{ model: Course }] }],
      });

      const stats = await Promise.all(
        attendanceRecords.map(async (record) => {
          const week = `Week ${record.get("week")}`;
          const total = record.get("total");
          const enrolledStudents = await Enrollment.count();
          const totalSessions = await CourseSession.count();
          const totalPossible = enrolledStudents * totalSessions;
          const averageRate = (total / totalPossible) * 100;

          return {
            week,
            total: total,
            averageRate: Number(averageRate.toFixed(2)),
          };
        })
      );

      return stats;
    } catch (error) {
      throw new Error(
        `Failed to calculate weekly attendance: ${error.message}`
      );
    }
  }
}

module.exports = new AttendanceRepository();
