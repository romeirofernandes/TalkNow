const express = require('express');
const cors = require('cors');
const config = require('./config');
const apiRoutes = require('./routes/api');
const logger = require('./utils/logger');

function createExpressApp() {
  const app = express();

  app.use(cors({
    origin: config.cors.origin,
    methods: config.cors.methods,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(express.static('public'));

  app.use('/api', apiRoutes);

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(err.status || 500).json({
      error: {
        message: err.message
      }
    });
  });

  return app;
}

module.exports = createExpressApp;
