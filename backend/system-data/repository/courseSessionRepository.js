const { CourseSession, Course, Venue } = require('../models/model');

class CourseSessionRepository {
  // Check if a session is ongoing based on current time
  async isSessionOngoing(session) {
    try {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}:00`;
      return (
        session.start_time <= currentTime && currentTime <= session.end_time
      );
    } catch (error) {
      throw new Error(`Failed to check session status: ${error.message}`);
    }
  }

  // Get venue geolocations by venue name
  async getVenueGeolocations(vName) {
    try {
      const venue = await Venue.findByPk(vName, {
        attributes: ["v_name", "geolocations"],
      });
      if (!venue) {
        throw new Error(`Venue ${vName} not found`);
      }
      return venue.geolocations; // Decrypted via model getter
    } catch (error) {
      throw new Error(`Failed to fetch venue geolocations: ${error.message}`);
    }
  }

  // Get course sessions by level, department, and day
  async getSessionsByLevelDepartmentAndDay(level, department, day) {
    try {
      if (!level || !department || !day) {
        throw new Error("Missing level, department, or day");
      }
      const sessions = await CourseSession.findAll({
        include: [
          {
            model: Course,
            where: { level, department },
            attributes: ["course_ID", "title", "department", "level"],
          },
          { model: Venue, attributes: ["v_name"] },
        ],
        where: { day },
      });
      // Add ongoing status to each session
      // const sessionsWithStatus = await Promise.all(
      //   sessions.map(async (session) => {
      //     const ongoing = await this.isSessionOngoing(session);
      //     return { ...session.toJSON(), ongoing };
      //   })
      // );
      return sessions;
    } catch (error) {
      throw new Error(`Failed to fetch course sessions: ${error.message}`);
    }
  }
  // Edit course schedule
  async editCourseSchedule(
    sessionId,
    { courseID, day, startTime, endTime, vName }
  ) {
    try {
      const course = await Course.findOne({
        where: { course_ID: courseID },
      });
      if (!course) {
        throw new Error("Course not found");
      }
      const venue = await Venue.findByPk(vName);
      if (!venue) {
        throw new Error("Venue not found");
      }
      await CourseSession.upsert({
        ID: sessionId,
        course_ID: courseID,
        day,
        start_time: startTime,
        end_time: endTime,
        v_name: vName,
      });
      return { message: "Course schedule updated successfully" };
    } catch (error) {
      throw new Error(`Failed to edit course schedule: ${error.message}`);
    }
  }

  // Get course schedules for a specific course
  async getCourseSchedules(courseID) {
    try {
      const course = await Course.findOne({
        where: { course_ID: courseID },
      });
      if (!course) {
        throw new Error("Course not found");
      }
      return await CourseSession.findAll({
        where: { course_ID: courseID },
        include: [{ model: Venue }],
      });
    } catch (error) {
      throw new Error(`Failed to fetch course schedules: ${error.message}`);
    }
  }

  // get course schedule for a specific day of the week

  async getCourseSchedules_byDay(day) {
    try {
      const course_sessions = await CourseSession.findAll({
        where: { day: day },
        include: [{ model: Venue }],
      });
      if (!course_sessions || course_sessions.length === 0) {
        throw new Error(`No course schedules found for day: ${day}`);
      }
      return course_sessions
    } catch (error) {
      throw new Error(`Failed to fetch course schedules: ${error.message}`);
    }
  }

  // Get full course + instructor + venue details for a given session ID
  async getCourseDetailsBySessionID(sessionID) {
    try {
      const session = await CourseSession.findByPk(sessionID, {
        include: [
          {
            model: Course,
            attributes: ["course_ID", "title", "department", "level"],
            include: [
              {
                model: CourseAssignment,
                include: [
                  {
                    model: Instructor,
                    attributes: ["name", "email"],
                  },
                ],
              },
            ],
          },
          {
            model: Venue,
            attributes: ["v_name"],
          },
        ],
      });

      if (!session) {
        throw new Error(`Course session with ID ${sessionID} not found`);
      }

      const course = session.course;
      const venue = session.venue;
      const instructor = course?.course_assignments?.[0]?.instructor;

      return {
        courseID: course.course_ID,
        courseTitle: course.title,
        instructorName: instructor?.name || "Unknown",
        instructorEmail: instructor?.email || "Unknown",
        venueName: venue?.v_name || "Unknown",
      };
    } catch (error) {
      throw new Error(`Failed to get course details: ${error.message}`);
    }
  }

  // Get all course schedules
  async getAllCourseSchedules() {
    try {
      return await CourseSession.findAll({
        include: [{ model: Course }, { model: Venue }],
      });
    } catch (error) {
      throw new Error(`Failed to fetch all course schedules: ${error.message}`);
    }
  }

  async bulkUpsertCourseSessions(sessions) {
    try {
      const upsertPromises = sessions.map(async (session) => {
        const course = await Course.findOne({
          where: { course_ID: session.course_ID },
        });
        if (!course) {
          throw new Error(`Course ${session.course_ID} not found`);
        }
        const venue = await Venue.findByPk(session.v_name);
        if (!venue) {
          throw new Error(`Venue ${session.v_name} not found`);
        }
        return CourseSession.upsert({
          ID: session.ID,
          course_ID: session.course_ID,
          day: session.day,
          start_time: session.start_time,
          end_time: session.end_time,
          v_name: session.v_name,
        });
      });
      await Promise.all(upsertPromises);
      return { message: "Course sessions processed successfully" };
    } catch (error) {
      throw new Error(`Failed to upsert course sessions: ${error.message}`);
    }
  }
}

module.exports = new CourseSessionRepository();