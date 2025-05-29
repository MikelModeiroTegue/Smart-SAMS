const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.post('/api/timetable', (req, res) => {
  const { year, semester, timetable } = req.body;
  const content = {
    year,
    semester,
    timetable,
  };
  fs.writeFileSync('../src/data/timetable.json', JSON.stringify(content, null, 2));
  res.status(200).send({ message: 'Timetable saved.' });
});

module.exports = app;