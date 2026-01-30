const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js Authentication API',
      version: '1.0.0',
      description: 'A simple authentication and authorization API built with Node.js and Express',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            username: {
              type: 'string',
              example: 'johndoe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              example: 'user',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T12:00:00Z',
            },
          },
        },
        Register: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: {
              type: 'string',
              example: 'johndoe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 6,
              example: 'password123',
            },
          },
        },
        Login: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123',
            },
          },
        },
        UpdateProfile: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              example: 'newusername',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'newemail@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 6,
              example: 'newpassword123',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
