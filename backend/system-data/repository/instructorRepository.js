const { Instructor, Course, CourseAssignment } = require('../models/model');

class InstructorRepository {
  // Get all instructors
  async getAllInstructors() {
    try {
      return await Instructor.findAll();
    } catch (error) {
      throw new Error(`Failed to fetch instructors: ${error.message}`);
    }
  }

  // Delete an instructor
  async deleteInstructor(email) {
    try {
      const instructor = await Instructor.findByPk(email);
      if (!instructor) {
        throw new Error('Instructor not found');
      }
      await instructor.destroy();
      return { message: 'Instructor deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete instructor: ${error.message}`);
    }
  }

  // Edit assigned instructor for a course
  async editAssignedInstructor(courseCode, semesterPeriod, instructorEmail) {
    try {
      const course = await Course.findOne({ 
        where: { code: courseCode, semester_period: semesterPeriod } 
      });
      if (!course) {
        throw new Error('Course not found');
      }
      const instructor = await Instructor.findByPk(instructorEmail);
      if (!instructor) {
        throw new Error('Instructor not found');
      }
      await CourseAssignment.upsert({
        course_code: courseCode,
        semester_period: semesterPeriod,
        instructor_email: instructorEmail,
      });
      return { message: 'Instructor assignment updated successfully' };
    } catch (error) {
      throw new Error(`Failed to assign instructor: ${error.message}`);
    }
  }
    
  async bulkUpsertInstructors(instructors) {
    try {
      const upsertPromises = instructors.map(instructor =>
        Instructor.upsert({
          email: instructor.email,
          name: instructor.name,
        })
      );
      await Promise.all(upsertPromises);
      return { message: 'Instructors processed successfully' };
    } catch (error) {
      throw new Error(`Failed to upsert instructors: ${error.message}`);
    }
  }
}

module.exports = new InstructorRepository();