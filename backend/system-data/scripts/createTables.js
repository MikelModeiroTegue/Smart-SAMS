require('dotenv').config({ path: '/home/modeiro/Smart-SAMS/backend/.env' }); // Explicitly load .env
const { sequelize } = require('../models/model');

async function createTables() {
  try {
    console.log('DATABASE_URL:', process.env.DATABASE_URL); // Debug
    await sequelize.sync({ force: false }); // false for production
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error.message, error);
  } finally {
    await sequelize.close(); // Close connection
  }
}

createTables();