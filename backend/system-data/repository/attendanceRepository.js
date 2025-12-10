const { sequelize } = require("../models/model");
const {
  Attendance,
  Course,
  Student,
  CourseSession,
  Enrollment,
} = require("../models/model");
const { Op } = require("sequelize");

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
  async getAttendanceByCourseSession(ID) {
    try {
      return await Attendance.findAll({
        where: { courseSessionSchedule_ID: ID },
        include: [
          { model: Student },
          {
            model: CourseSession,
            include: [{ model: Course }],
          },
        ],
      });
    } catch (error) {
      throw new Error(
        `Failed to fetch attendance for course session: ${error.message}`
      );
    }
  }

  // Store attendance record
  async storeAttendance({
    courseSessionSchedule_ID,
    student_matricule,
    blockchainTxID,
    date, // Optional parameter
  }) {
    // Validate required fields
    if (!courseSessionSchedule_ID || !student_matricule || !blockchainTxID) {
      throw new Error(
        "Missing required attendance fields: courseSessionSchedule_ID, student_matricule, or blockchainTxID"
      );
    }

    // Use provided date or current date
    const attendanceDate = date ? new Date(date) : new Date();

    // Format date to YYYY-MM-DD for consistent comparison (removes time component)
    const dateOnly = attendanceDate.toISOString().split("T")[0];

    try {
      // Check if attendance already exists for this date (comparing date only, not time)
      const existing = await Attendance.findOne({
        where: {
          courseSessionSchedule_ID,
          student_matricule,
          date: {
            [Op.gte]: new Date(dateOnly + "T00:00:00.000Z"),
            [Op.lt]: new Date(dateOnly + "T23:59:59.999Z"),
          },
        },
      });

      if (existing) {
        throw new Error(
          "Attendance already recorded for this session and date"
        );
      }

      // Validate course session and student exist
      const courseSession = await CourseSession.findByPk(
        courseSessionSchedule_ID
      );
      const student = await Student.findByPk(student_matricule);

      if (!courseSession) {
        throw new Error("Invalid course session ID");
      }
      if (!student) {
        throw new Error("Invalid student matricule");
      }

      // Create attendance record
      const attendance = await Attendance.create({
        // Remove the random ID generation - let the database handle auto-increment
        courseSessionSchedule_ID,
        student_matricule,
        blockchainTxID,
        date: attendanceDate,
      });

      console.log("Attendance stored successfully:", attendance.id);
      return attendance;
    } catch (error) {
      console.error("Error storing attendance:", error.message);
      throw new Error(`Failed to store attendance: ${error.message}`);
    }
  }

  // Get attendance rates per course
  async getAttendanceRates() {
    try {
      // First check if we have the required models
      if (!Enrollment) {
        throw new Error("Enrollment model is not available");
      }

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

      if (!courses || courses.length === 0) {
        return []; // Return empty array instead of throwing error
      }

      const rates = await Promise.all(
        courses.map(async (course) => {
          try {
            const totalSessions = course.CourseSessions?.length || 0;
            const enrolledStudents = course.Enrollments?.length || 0;

            // Skip calculation if no sessions or students
            if (totalSessions === 0 || enrolledStudents === 0) {
              return {
                courseID: course.course_ID,
                courseName: course.name || "Unnamed Course",
                rate: 0,
              };
            }

            const sessionIds = course.CourseSessions.map((s) => s.ID).filter(
              Boolean
            );
            if (sessionIds.length === 0) {
              return {
                courseID: course.course_ID,
                courseName: course.name || "Unnamed Course",
                rate: 0,
              };
            }

            const attendanceRecords = await Attendance.count({
              where: {
                courseSessionSchedule_ID: sessionIds,
              },
            });

            const totalPossibleAttendance = totalSessions * enrolledStudents;
            const rate =
              totalPossibleAttendance > 0
                ? (attendanceRecords / totalPossibleAttendance) * 100
                : 0;

            return {
              courseID: course.course_ID,
              courseName: course.name || "Unnamed Course",
              rate: Number(rate.toFixed(2)),
            };
          } catch (courseError) {
            console.error(
              `Error processing course ${course.course_ID}:`,
              courseError
            );
            return {
              courseID: course.course_ID,
              courseName: course.name || "Unnamed Course",
              rate: 0,
              error: courseError.message,
            };
          }
        })
      );

      return rates.filter(Boolean); // Remove any null/undefined entries
    } catch (error) {
      console.error("Error in getAttendanceRates:", error);
      // Return a meaningful error structure that the frontend can handle
      return [
        {
          error: true,
          message: error.message,
          rates: [],
        },
      ];
    }
  }

  // Get weekly attendance statistics
  async getWeeklyAttendance() {
    try {
      const weekTrunc = `DATE_TRUNC('week', "attendance"."date")`;

      const attendanceRecords = await Attendance.findAll({
        attributes: [
          [sequelize.literal(weekTrunc), "week"],
          [sequelize.fn("COUNT", sequelize.col("id")), "total"],
        ],
        group: [sequelize.literal(weekTrunc)],
        raw: true,
      });

      const enrolledStudents = await Enrollment.count();
      const totalSessions = await CourseSession.count();
      const totalPossible = enrolledStudents * totalSessions;

      const stats = attendanceRecords.map((record) => {
        const weekDate = new Date(record.week);
        const weekLabel = weekDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const total = parseInt(record.total, 10);
        const averageRate =
          totalPossible > 0 ? (total / totalPossible) * 100 : 0;

        return {
          weekLabel,
          total,
          averageRate: Number(averageRate.toFixed(2)),
        };
      });

      return stats;
    } catch (error) {
      throw new Error(
        `Failed to calculate weekly attendance: ${error.message}`
      );
    }
  }
}

module.exports = new AttendanceRepository();
