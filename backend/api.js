const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./fabric-client/config/swaggerConfig');
const authRoutes = require('./system-data/routes/authRoutes');
const session = require('express-session');
const passport = require('./strategies/googleStrategy');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Swagger UI setup
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// session authentication
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/admin', routes);

app.use('/auth', authRoutes);

app.use('/api/enroll', require('./fabric-client/routes/enrollRoutes'));

app.use('/api/transaction', require('./fabric-client/routes/transactionRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;