const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const courseRepository = require('../system-data/repository/courseRepository');
const instructorRepository = require('../system-data/repository/instructorRepository');
const courseSessionRepository = require('../system-data/repository/courseSessionRepository');
const venueRepository = require('../system-data/repository/venueRepository');
const courseAssignmentRepository = require('../system-data/repository/courseAssignmentRepository');

class TimetableService {
  async loadTimetable() {
    try {
      // Read data.json
      const filePath = path.join(__dirname, '../system-data/timetable.json');
      const rawData = await fs.readFile(filePath, 'utf8');
      const { timetable } = JSON.parse(rawData);

      // Step 1: Populate Venues
      const venues = [...new Set(timetable.map(item => item.Hall))].map(hall => ({
        v_name: hall,
        geolocations: null,
      }));
      await venueRepository.bulkUpsertVenues(venues);

      // Step 2: Populate Courses
      const courses = timetable.map(item => ({
        course_ID: `${item['Course Code']}-${item.Semester}_${item.Year}`, // Combine into course_ID
        department: item.Department,
        title: item['Course Title'],
        level: item.Semester.toString(),
      }));
      await courseRepository.bulkUpsertCourses(courses);

      // Step 3: Populate Instructors
      const instructors = [];
      timetable.forEach(item => {
        if (item.Instructor1) {
          instructors.push({
            email: this.generateEmail(item.Instructor1),
            name: item.Instructor1,
          });
        }
        if (item.Instructor2) {
          instructors.push({
            email: this.generateEmail(item.Instructor2),
            name: item.Instructor2,
          });
        }
      });
      const uniqueInstructors = [...new Map(instructors.map(i => [i.email, i])).values()];
      await instructorRepository.bulkUpsertInstructors(uniqueInstructors);

      // Step 4: Populate Course Sessions
      const sessions = timetable.map(item => ({
        ID: uuidv4(),
        course_ID: `${item['Course Code']}-${item.Semester}_${item.Year}`, // Use course_ID
        day: item.Day,
        start_time: this.convertTime(item['Start Time']),
        end_time: this.convertTime(item['End Time']),
        v_name: item.Hall,
      }));
      await courseSessionRepository.bulkUpsertCourseSessions(sessions);

      // Step 5: Populate Course Assignments
      const assignments = [];
      timetable.forEach(item => {
        const courseID = `${item['Course Code']}-${item.Semester}_${item.Year}`; // Generate course_ID
        if (item.Instructor1) {
          assignments.push({
            course_ID: courseID,
            instructor_email: this.generateEmail(item.Instructor1),
          });
        }
        if (item.Instructor2) {
          assignments.push({
            course_ID: courseID,
            instructor_email: this.generateEmail(item.Instructor2),
          });
        }
      });
      await courseAssignmentRepository.bulkUpsertAssignments(assignments);

      return { message: 'Timetable data loaded successfully' };
    } catch (error) {
      throw new Error(`Failed to load timetable: ${error.message}`);
    }
  }

  // Generate email from instructor name (e.g., "Dr. NGUTI" -> "dr.nguti@example.com")
  generateEmail(name) {
    return `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`;
  }

  // Convert decimal time (e.g., 0.2916666666666667) to HH:MM:SS format
  convertTime(decimalTime) {
    const hours = Math.floor(decimalTime * 24);
    const minutes = Math.round((decimalTime * 24 - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  }
}

module.exports = new TimetableService();