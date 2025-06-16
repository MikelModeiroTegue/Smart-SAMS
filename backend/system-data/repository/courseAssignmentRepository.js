const { CourseAssignment, Instructor, Course } = require('../models/model');

class CourseAssignmentRepository {
  // Get assignments for a specific course
  async getAssignmentsByCourse(courseID) {
    try {
      return await CourseAssignment.findAll({
        where: { course_ID: courseID },
        include: [{ model: Instructor }],
      });
    } catch (error) {
      throw new Error(`Failed to fetch course assignments: ${error.message}`);
    }
  }
    
  // Bulk upsert course assignments
  async bulkUpsertAssignments(assignments) {
    try {
      const upsertPromises = assignments.map(async assignment => {
        const course = await Course.findOne({
          where: { course_ID: assignment.course_ID }
        });
        if (!course) {
          throw new Error(`Course ${assignment.course_ID} not found`);
        }
        const instructor = await Instructor.findByPk(assignment.instructor_email);
        if (!instructor) {
          throw new Error(`Instructor ${assignment.instructor_email} not found`);
        }
        return CourseAssignment.upsert({
          course_ID: assignment.course_ID,
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