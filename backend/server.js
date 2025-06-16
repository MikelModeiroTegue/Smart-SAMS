const app = require('./api');
const { sequelize } = require('./system-data/config/db');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';  // Listen on all network interfaces

sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to sync database:', error);
});
