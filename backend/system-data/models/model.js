const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');
const crypto = require('crypto');
require('dotenv').config();

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const IV_LENGTH = 16;

const Instructor = sequelize.define('instructors', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, primaryKey: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

const Course = sequelize.define('courses', {
  course_ID: { type: DataTypes.STRING, primaryKey: true }, // Combined code and semester_period
  department: { type: DataTypes.STRING },
  level: { type: DataTypes.STRING },
  title: { type: DataTypes.STRING },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

const CourseAssignment = sequelize.define('course_assignments', {
  instructor_email: { 
    type: DataTypes.STRING, 
    primaryKey: true, 
    references: { model: Instructor, key: 'email' } 
  },
  course_ID: { 
    type: DataTypes.STRING, 
    primaryKey: true, 
    references: { model: Course, key: 'course_ID' } 
  },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

const CourseSession = sequelize.define('course_sessions', {
  ID: { type: DataTypes.STRING, primaryKey: true },
  course_ID: { type: DataTypes.STRING }, // Reference course_ID
  day: { type: DataTypes.STRING },
  start_time: { type: DataTypes.TIME },
  end_time: { type: DataTypes.TIME },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  v_name: { type: DataTypes.STRING },
});

const Venue = sequelize.define('venues', {
  v_name: { type: DataTypes.STRING, primaryKey: true },
  geolocations: {
    type: DataTypes.STRING,
    allowNull: true,
    get() {
      const encryptedValue = this.getDataValue('geolocations');
      if (encryptedValue) {
        const [ivHex, encryptedHex] = encryptedValue.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
        let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
      }
      return null;
    },
    set(value) {
      if (value) {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
        let encrypted = cipher.update(JSON.stringify(value), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        this.setDataValue('geolocations', `${iv.toString('hex')}:${encrypted}`);
      }
    },
  },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

const Student = sequelize.define('students', {
  matricule: { type: DataTypes.STRING, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  phoneNum: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  department: { type: DataTypes.STRING },
  deviceInfo: { type: DataTypes.JSON },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

const Enrollment = sequelize.define('enrollments', {
  student_matricule: { 
    type: DataTypes.STRING, 
    primaryKey: true, 
    references: { model: Student, key: 'matricule' } 
  },
  course_ID: { 
    type: DataTypes.STRING, 
    primaryKey: true, 
    references: { model: Course, key: 'course_ID' } 
  },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

const Attendance = sequelize.define('attendance', {
  courseSessionSchedule_ID: { 
    type: DataTypes.STRING, 
    references: { model: CourseSession, key: 'ID' } 
  },
  date: { type: DataTypes.DATE },
  blockchainTxID: { type: DataTypes.STRING },
  student_matricule: { 
    type: DataTypes.STRING, 
    references: { model: Student, key: 'matricule' } 
  },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  indexes: [{ unique: true, fields: ['courseSessionSchedule_ID', 'student_matricule', 'date'] }],
});

// Relationships
Instructor.hasMany(CourseAssignment, { foreignKey: 'instructor_email' });
Course.hasMany(CourseAssignment, { foreignKey: 'course_ID' });
CourseAssignment.belongsTo(Instructor, { foreignKey: 'instructor_email' });
CourseAssignment.belongsTo(Course, { foreignKey: 'course_ID' });

Student.hasMany(Enrollment, { foreignKey: 'student_matricule' });
Course.hasMany(Enrollment, { foreignKey: 'course_ID' });
Enrollment.belongsTo(Student, { foreignKey: 'student_matricule' });
Enrollment.belongsTo(Course, { foreignKey: 'course_ID' });

Student.hasMany(Attendance, { foreignKey: 'student_matricule' });
Attendance.belongsTo(Student, { foreignKey: 'student_matricule' });
CourseSession.belongsTo(Course, { foreignKey: 'course_ID' });
Course.hasMany(CourseSession, { foreignKey: 'course_ID' });
CourseSession.belongsTo(Venue, { foreignKey: 'v_name' });
Venue.hasMany(CourseSession, { foreignKey: 'v_name' });
CourseSession.hasMany(Attendance, { foreignKey: 'courseSessionSchedule_ID' });
Attendance.belongsTo(CourseSession, { foreignKey: "courseSessionSchedule_ID" });

module.exports = { Instructor, Course, CourseAssignment, CourseSession, Venue, Student, Enrollment, Attendance, sequelize };