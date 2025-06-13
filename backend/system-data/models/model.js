const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const crypto = require('crypto');
require('dotenv').config();

const Instructor = sequelize.define('instructors', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, primaryKey: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

const Course = sequelize.define('courses', {
  code: { type: DataTypes.STRING },
  semester_period: { type: DataTypes.STRING },
  department: { type: DataTypes.STRING },
  level: { type: DataTypes.STRING },
  title: { type: DataTypes.STRING },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  primaryKey: {
    type: DataTypes.STRING,
    fields: ['code', 'semester_period']
  }
});

const CourseAssignment = sequelize.define('course_assignments', {
  instructor_email: { type: DataTypes.STRING, primaryKey: true, references: { model: Instructor, key: 'email' } },
  course_code: { type: DataTypes.STRING, primaryKey: true, references: { model: Course, key: 'code' } },
  semester_period: { type: DataTypes.STRING, primaryKey: true, references: { model: Course, key: 'semester_period' } },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

const CourseSession = sequelize.define('course_sessions', {
  ID: { type: DataTypes.STRING, primaryKey: true },
  course_code: { type: DataTypes.STRING },
  semester_period: { type: DataTypes.STRING },
  day: { type: DataTypes.STRING },
  start_time: { type: DataTypes.TIME },
  end_time: { type: DataTypes.TIME },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  v_name: { type: DataTypes.STRING },
});

const Venue = sequelize.define('venues', {
  v_name: { type: DataTypes.STRING, primaryKey: true },
  geolocations: {
    type: DataTypes.JSON, allowNull: true,
    get() {
      const encryptedValue = this.getDataValue('geolocations');
      if (encryptedValue) {
        const decipher = crypto.createDecipheriv('aes-256-cbc', process.env.ENCRYPTION_KEY);
        let decrypted = decipher.update(encryptedValue, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
      }
      return null;
    },
    set(value) {
      if (value) {
        const cipher = crypto.createCipheriv('aes-256-cbc', process.env.ENCRYPTION_KEY);
        let encrypted = cipher.update(JSON.stringify(value), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        this.setDataValue('geolocations', encrypted);
      }
    }
  },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

const Student = sequelize.define('students', {
  matricule: { type: DataTypes.STRING, primaryKey: true },
  name: { type: DataTypes.STRING },
  phone_num: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  department: { type: DataTypes.STRING },
  deviceInfo: { type: DataTypes.STRING },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

const Enrollment = sequelize.define('enrollments', {
  student_matricule: { type: DataTypes.STRING, primaryKey: true, references: { model: Student, key: 'matricule' } },
  course_code: { type: DataTypes.STRING, primaryKey: true, references: { model: Course, key: 'code' } },
  semester_period: { type: DataTypes.STRING, primaryKey: true, references: { model: Course, key: 'semester_period' } },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

const Attendance = sequelize.define('attendance', {
  courseSessionSchedule_ID: { type: DataTypes.STRING, references: { model: CourseSession, key: 'ID' } },
  date: { type: DataTypes.DATE },
  blockchainTxID: { type: DataTypes.STRING },
  student_matricule: { type: DataTypes.STRING, references: { model: Student, key: 'matricule' } },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  uniqueKeys: { uniqueAttendance: { fields: ['courseSessionSchedule_ID', 'student_matricule', 'date'] } }
});

// Relationships
Instructor.hasOne(Course, { through: CourseAssignment, foreignKey: 'instructor_email' });
Course.belongsTo(Instructor, { through: CourseAssignment, foreignKey: 'course_code', otherKey: 'semester_period' });
CourseAssignment.belongsTo(Instructor, { foreignKey: 'instructor_email' });
CourseAssignment.belongsTo(Course, { foreignKey: ['course_code', 'semester_period'] });

Student.hasMany(Enrollment, { foreignKey: 'student_matricule' });
Course.hasMany(Enrollment, { foreignKey: ['course_code', 'semester_period'] });
Enrollment.belongsTo(Student, { foreignKey: 'student_matricule' });
Enrollment.belongsTo(Course, { foreignKey: ['course_code', 'semester_period'] });

Student.hasMany(Attendance, { foreignKey: 'student_matricule' });
Attendance.belongsTo(Student, { foreignKey: 'student_matricule' });
CourseSession.belongsTo(Course, { foreignKey: ['course_code', 'semester_period'] });
Course.hasMany(CourseSession, { foreignKey: ['course_code', 'semester_period'] });
CourseSession.belongsTo(Venue, { foreignKey: 'v_name' });
Venue.hasMany(CourseSession, { foreignKey: 'v_name' });

module.exports = { Instructor, Course, CourseAssignment, CourseSession, Venue, Student, Enrollment, Attendance, sequelize };