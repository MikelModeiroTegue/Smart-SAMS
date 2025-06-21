const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./system-data/routes/routes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./fabric-client/config/swaggerConfig");
const authRoutes = require("./system-data/routes/authRoutes");
const session = require("express-session");
const passport = require("./logic/authLogic");
const courseSessionRepository = require("./system-data/repository/courseSessionRepository");
const studentRepository = require("./system-data/repository/studentRepository");
const enrollmentRepository = require("./system-data/repository/enrollmentRepository");


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Swagger UI setup
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Session authentication
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Admin routes
app.use("/api/admin", routes);


// Auth routes
app.use("/auth", authRoutes);

// Enrollment routes
app.use("/api/enroll", require("./fabric-client/routes/enrollRoutes"));

// Transaction routes
app.use(
  "/api/transaction",
  require("./fabric-client/routes/transactionRoutes")
);

// Identity verification routes
app.use(require("./fabric-client/routes/identityVerif"));

// Student-facing session routes
app.post("/api/sessions", async (req, res) => {
  try {
    const { level, department } = req.body;
    if (!level || !department) {
      return res.status(400).json({ error: "Missing level or department" });
    }
    const now = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDay = days[now.getDay()];
    if (
      !["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].includes(
        currentDay
      )
    ) {
      return res
        .status(400)
        .json({ error: "No classes scheduled on weekends" });
    }
    const sessions =
      await courseSessionRepository.getSessionsByLevelDepartmentAndDay(
        level,
        department,
        currentDay
      );
    res.status(200).json(sessions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/student/matricule", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }
    const student = await studentRepository.getStudentByEmail(email);
    res.status(200).json({ matricule: student.matricule });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/enrollment/check", async (req, res) => {
  try {
    const { studentMatricule, courseID } = req.body;
    if (!studentMatricule || !courseID) {
      return res
        .status(400)
        .json({ error: "Missing student_matricule or course_ID" });
    }
    const isEnrolled = await enrollmentRepository.isStudentEnrolled(
      studentMatricule,
      courseID
    );
    res.status(200).json({ isEnrolled });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/enrollment", async (req, res) => {
  try {
    const { studentMatricule, courseID } = req.body;
    if (!studentMatricule || !courseID) {
      return res
        .status(400)
        .json({ error: "Missing student_matricule or course_ID" });
    }
    const result = await enrollmentRepository.enrollStudent(
      studentMatricule,
      courseID
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/venue/:vName/geolocations", async (req, res) => {
  try {
    const { vName } = req.params;
    if (!vName) {
      return res.status(400).json({ error: "Missing venue name" });
    }
    const geolocations = await courseSessionRepository.getVenueGeolocations(
      vName
    );
    res.status(200).json({ geolocations });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
