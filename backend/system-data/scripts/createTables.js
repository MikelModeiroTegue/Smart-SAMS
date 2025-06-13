const { sequelize } = require('../models/model');

async function createTables() {
  try {
    await sequelize.sync({ force: false }); // Set to true only for initial setup, false for production
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error.message);
  }
}

createTables();