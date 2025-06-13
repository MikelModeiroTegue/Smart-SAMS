require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { Sequelize } = require('sequelize');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: true, persistSession: false },
  realtime: { params: { eventsPerSecond: 10 } },
});

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

module.exports = { supabase, sequelize };