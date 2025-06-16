const { Course, Enrollment, Student } = require('../models/model');

class CourseRepository {
  // Get all courses
  async getAllCourses() {
    try {
      return await Course.findAll();
    } catch (error) {
      throw new Error(`Failed to fetch courses: ${error.message}`);
    }
  }

  // Get all students enrolled in a course
  async getStudentsEnrolled(courseID) {
    try {
      const course = await Course.findOne({ 
        where: { course_ID: courseID } 
      });
      if (!course) {
        throw new Error('Course not found');
      }
      return await Enrollment.findAll({
        where: { course_ID: courseID },
        include: [{ model: Student }],
      });
    } catch (error) {
      throw new Error(`Failed to fetch enrolled students: ${error.message}`);
    }
  }
    
  async bulkUpsertCourses(courses) {
    try {
      const upsertPromises = courses.map(course =>
        Course.upsert({
          course_ID: course.course_ID,
          department: course.department,
          title: course.title,
          level: course.level,
        })
      );
      await Promise.all(upsertPromises);
      return { message: 'Courses processed successfully' };
    } catch (error) {
      throw new Error(`Failed to upsert courses: ${error.message}`);
    }
  }
}

module.exports = new CourseRepository();