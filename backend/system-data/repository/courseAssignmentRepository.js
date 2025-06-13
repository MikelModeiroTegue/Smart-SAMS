const { CourseAssignment, Instructor, Course } = require('../models/model');

class CourseAssignmentRepository {
  // This can be used if additional course assignment logic is needed
  async getAssignmentsByCourse(courseCode, semesterPeriod) {
    try {
      return await CourseAssignment.findAll({
        where: { course_code: courseCode, semester_period: semesterPeriod },
        include: [{ model: Instructor }],
      });
    } catch (error) {
      throw new Error(`Failed to fetch course assignments: ${error.message}`);
    }
  }
    
  async bulkUpsertAssignments(assignments) {
    try {
      const upsertPromises = assignments.map(async assignment => {
        const course = await Course.findOne({
          where: { code: assignment.course_code, semester_period: assignment.semester_period }
        });
        if (!course) {
          throw new Error(`Course ${assignment.course_code} not found`);
        }
        const instructor = await Instructor.findByPk(assignment.instructor_email);
        if (!instructor) {
          throw new Error(`Instructor ${assignment.instructor_email} not found`);
        }
        return CourseAssignment.upsert({
          course_code: assignment.course_code,
          semester_period: assignment.semester_period,
          instructor_email: assignment.instructor_email,
        });
      });
      await Promise.all(upsertPromises);
      return { message: 'Course assignments processed successfully' };
    } catch (error) {
      throw new Error(`Failed to upsert course assignments: ${error.message}`);
    }
  }
}

module.exports = new CourseAssignmentRepository();