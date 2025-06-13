const app = require('./api');
const { sequelize } = require('./config/db');
require('dotenv').config();


// Start server and sync database
const PORT = process.env.PORT || 3000;
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to sync database:', error);
});
