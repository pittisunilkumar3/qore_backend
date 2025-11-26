const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const express = require('express');
const swaggerOptions = require('../config/swagger');

const router = express.Router();

// Generate Swagger specification
const specs = swaggerJsdoc(swaggerOptions);

// Configure Swagger UI
const uiOptions = {
  explorer: true,
  swaggerCss: '/swagger-ui/swagger-ui.css',
  customCss: '.swagger-ui .topbar { display: none } .swagger-ui .info { margin: 20px 0; } .swagger-ui .info div { width: auto }',
  customSiteTitle: 'Qore Employee Management API Documentation',
  customfavIcon: '/favicon.ico'
};

// Serve Swagger documentation
router.use('/', swaggerUi.serve);
router.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

module.exports = router;