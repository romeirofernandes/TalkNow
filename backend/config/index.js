const mediasoup = require('./mediasoup');

module.exports = {
  env: process.env.NODE_ENV || 'development',
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0'
  },
  mediasoup,
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST']
  },
  logLevel: process.env.LOG_LEVEL || 'info'
};