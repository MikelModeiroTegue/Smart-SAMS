const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./fabric-client/config/swaggerConfig');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Swagger UI setup
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.post('/api/timetable', (req, res) => {
  const { year, semester, timetable } = req.body;
  const content = {
    year,
    semester,
    timetable,
  };
  fs.writeFileSync('./system-data/timetable.json', JSON.stringify(content, null, 2));
  res.status(200).send({ message: 'Timetable saved.' });
});

app.use('/api/enroll', require('./fabric-client/routes/enrollRoutes'));
app.use('/api/transaction', require('./fabric-client/routes/transactionRoutes'));


module.exports = app;