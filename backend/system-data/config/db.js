require('dotenv').config();
const { Sequelize } = require('sequelize');

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env");
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  pool: { max: 20, min: 0, acquire: 30000, idle: 10000 },
  logging: false,
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
  }
}

testConnection();

module.exports = { sequelize };

testConnection();

module.exports = { sequelize };