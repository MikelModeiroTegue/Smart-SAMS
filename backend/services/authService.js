const { Student, Instructor } = require("../system-data/models/model");
const axios = require("axios");

class AuthService {
  async processGoogleUser(user) {
    const { email, name, picture } = user;

    try {
      // 1. Check if user is an instructor
      const instructor = await Instructor.findOne({ where: { email } });
      if (instructor) {
        return {
          id: instructor.email,
          role: "instructor",
          email,
          name,
          picture,
          newUser: false,
        };
      }

      // 2. Check if user exists in Student DB
      const student = await Student.findOne({ where: { email } });

      if (!student) {
        // New user - enroll and return newUser flag
        console.log("Brand new user detected. Enrolling in Fabric CA...");

        try {
          const enrollResponse = await axios.post(
            "http://localhost:3000/api/enroll",
            {
              userId: email,
              affiliation: "org1.department1",
            }
          );
          console.log("Fabric enrollment successful:", enrollResponse.data);
        } catch (error) {
          console.error(
            "Fabric enrollment failed:",
            error.response?.data || error.message
          );
          throw new Error("Fabric enrollment failed");
        }

        return {
          id: email,
          role: "student",
          email,
          name,
          picture,
          newUser: true,
        };
      } else {
        // Student exists - assume they have Fabric identity or enroll if needed
        // You can choose to enroll again here if you want to be sure or skip
        console.log("Student found in DB - assuming Fabric identity exists.");

        return {
          id: student.matricule,
          role: "student",
          email: student.email,
          name: student.name,
          picture,
          newUser: false,
        };
      }
    } catch (error) {
      throw new Error(`Failed to process Google user: ${error.message}`);
    }
  }

  async registerStudent({
    matricule,
    email,
    name,
    phoneNum,
    department,
    deviceInfo,
  }) {
    try {
      const existingStudent = await Student.findOne({ where: { matricule } });
      if (existingStudent) {
        throw new Error("Matricule already exists");
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
        role: "student",
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
