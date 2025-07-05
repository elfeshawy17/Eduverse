import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Educational Platform API',
    description: 'API documentation for the Educational Platform',
  },
  host: 'localhost:3000',
  schemes: ['http'],
  securityDefinitions: {
    BearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Enter your JWT token in the format: Bearer <token>',
    },
  },
  security: [{ BearerAuth: [] }],
};

const outputFile = './swagger-output.json';
const routes = ['./server.js'];

swaggerAutogen()(outputFile, routes, doc);
