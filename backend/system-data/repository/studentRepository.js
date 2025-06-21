const { Student, Enrollment } = require('../models/model');

class StudentRepository {
  // Get all students
  async getAllStudents() {
    try {
      return await Student.findAll();
    } catch (error) {
      throw new Error(`Failed to fetch students: ${error.message}`);
    }
  }

  // Update student
  async updateStudent(matricule, { name, phoneNum, email, department, deviceInfo }) {
    try {
      const student = await Student.findByPk(matricule);
      if (!student) {
        throw new Error('Student not found');
      }
      await student.update({ name, phone_num: phoneNum, email, department, deviceInfo });
      return { message: 'Student updated successfully' };
    } catch (error) {
      throw new Error(`Failed to update student: ${error.message}`);
    }
  }

  // Delete student
  async deleteStudent(matricule) {
    try {
      const student = await Student.findByPk(matricule);
      if (!student) {
        throw new Error('Student not found');
      }
      await student.destroy();
      return { message: 'Student deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete student: ${error.message}`);
    }
  }

    // Get student by email
    async getStudentByEmail(email) {
      try {
        if (!email || typeof email !== 'string') {
          throw new Error('Invalid email');
        }
        const student = await Student.findOne({
          where: { email },
          attributes: ['matricule', 'name', 'email'],
        });
        if (!student) {
          throw new Error('Student not found');
        }
        return student;
      } catch (error) {
        throw new Error(`Failed to fetch student: ${error.message}`);
      }
    }
  
    // Get student by matricule
    async getStudentByMatricule(matricule) {
      try {
        if (!matricule || typeof matricule !== 'string') {
          throw new Error('Invalid matricule');
        }
        const student = await Student.findByPk(matricule);
        if (!student) {
          throw new Error('Student not found');
        }
        return student;
      } catch (error) {
        throw new Error(`Failed to fetch student: ${error.message}`);
      }
    }
  }


module.exports = new StudentRepository();