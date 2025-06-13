const { sequelize } = require('../models/model');

async function modifyTables() {
  try {
    await sequelize.transaction(async (t) => {
      await sequelize.query(`
        ALTER TABLE students
        ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
      `, { transaction: t });

      await sequelize.query(`
        ALTER TABLE courses
        ADD COLUMN IF NOT EXISTS max_enrollment INT DEFAULT 50;
      `, { transaction: t });

      await sequelize.query(`
        ALTER TABLE course_sessions
        ADD COLUMN IF NOT EXISTS v_name VARCHAR(100) REFERENCES venues(v_name);
      `, { transaction: t });
    });
    console.log('Tables modified successfully');
  } catch (error) {
    console.error('Error modifying tables:', error.message);
  }
}

modifyTables();