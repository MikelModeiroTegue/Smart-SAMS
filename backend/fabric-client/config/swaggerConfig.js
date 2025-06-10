const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blockchain Attendance System API',
      version: '1.0.0',
      description: 'API documentation for the Hyperledger Fabric backend attendance system',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // adjust path to your routes
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
