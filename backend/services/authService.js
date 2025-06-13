const { Student, Instructor } = require('../system-data/models/model');

class AuthService {
  async processGoogleUser(user) {
    try {
      let dbUser = await Student.findOne({ where: { email: user.email } });
      if (!dbUser) {
        dbUser = await Instructor.findOne({ where: { email: user.email } });
      }

      if (dbUser) {
        return {
          id: dbUser.matricule || dbUser.email,
          role: dbUser.matricule ? 'student' : 'instructor',
          email: user.email,
          name: user.name,
          picture: user.picture,
          newUser: false,
        };
      } else {
        console.log('New user detected, requires registration');
        return {
          id: user.email,
          role: 'Student', // Temporary role until registration
          email: user.email,
          name: user.name,
          picture: user.picture,
          newUser: true, // Flag to trigger registration form
        };
      }
    } catch (error) {
      throw new Error(`Failed to process Google user: ${error.message}`);
    }
  }

  async registerStudent({ matricule, email, name, phoneNum, department, deviceInfo }) {
    try {
      const existingStudent = await Student.findOne({ where: { matricule } });
      if (existingStudent) {
        throw new Error('Matricule already exists');
      }
      const student = await Student.create({
        matricule,
        email,
        name,
        phoneNum,
        department,
        deviceInfo: deviceInfo || null,
      });
      return {
        id: student.matricule,
        role: 'student',
        email: student.email,
        name: student.name,
        picture: null, // Picture can be updated later
        newUser: false,
      };
    } catch (error) {
      throw new Error(`Failed to register student: ${error.message}`);
    }
  }
}

module.exports = new AuthService();