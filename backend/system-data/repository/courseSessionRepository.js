const { CourseSession, Course, Venue } = require('../models/model');

class CourseSessionRepository {
  // Edit course schedule
  async editCourseSchedule(sessionId, { courseCode, semesterPeriod, day, startTime, endTime, vName }) {
    try {
      const course = await Course.findOne({ 
        where: { code: courseCode, semester_period: semesterPeriod } 
      });
      if (!course) {
        throw new Error('Course not found');
      }
      const venue = await Venue.findByPk(vName);
      if (!venue) {
        throw new Error('Venue not found');
      }
      await CourseSession.upsert({
        ID: sessionId,
        course_code: courseCode,
        semester_period: semesterPeriod,
        day,
        start_time: startTime,
        end_time: endTime,
        v_name: vName,
      });
      return { message: 'Course schedule updated successfully' };
    } catch (error) {
      throw new Error(`Failed to edit course schedule: ${error.message}`);
    }
  }

  // Get course schedules for a specific course
  async getCourseSchedules(courseCode, semesterPeriod) {
    try {
      const course = await Course.findOne({ 
        where: { code: courseCode, semester_period: semesterPeriod } 
      });
      if (!course) {
        throw new Error('Course not found');
      }
      return await CourseSession.findAll({
        where: { course_code: courseCode, semester_period: semesterPeriod },
        include: [{ model: Venue }],
      });
    } catch (error) {
      throw new Error(`Failed to fetch course schedules: ${error.message}`);
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
      const upsertPromises = sessions.map(async session => {
        const course = await Course.findOne({
          where: { code: session.course_code, semester_period: session.semester_period }
        });
        if (!course) {
          throw new Error(`Course ${session.course_code} not found`);
        }
        const venue = await Venue.findByPk(session.v_name);
        if (!venue) {
          throw new Error(`Venue ${session.v_name} not found`);
        }
        return CourseSession.upsert({
          ID: session.ID,
          course_code: session.course_code,
          semester_period: session.semester_period,
          day: session.day,
          start_time: session.start_time,
          end_time: session.end_time,
          v_name: session.v_name,
        });
      });
      await Promise.all(upsertPromises);
      return { message: 'Course sessions processed successfully' };
    } catch (error) {
      throw new Error(`Failed to upsert course sessions: ${error.message}`);
    }
  }
}

module.exports = new CourseSessionRepository();