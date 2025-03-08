require("dotenv").config();
const http = require("http");
const createExpressApp = require("./app");
const { initializeSocketServer } = require("./socket");
const WorkerManager = require("./lib/worker");
const config = require("./config");
const logger = require("./utils/logger");

async function startServer() {
  try {
    const app = createExpressApp();

    const server = http.createServer(app);

    await WorkerManager.createWorkers();

    initializeSocketServer(server);

    server.listen(config.server.port, config.server.host, () => {
      logger.info(
        `Server is running on ${config.server.host}:${config.server.port}`
      );
    });

    const gracefulShutdown = async () => {
      logger.info("Received shutdown signal, closing server...");

      server.close(() => {
        logger.info("HTTP server closed");

        WorkerManager.close();
        logger.info("Mediasoup workers closed");

        process.exit(0);
      });

      setTimeout(() => {
        logger.error("Forced server shutdown after timeout");
        process.exit(1);
      }, 5000);
    };

    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

startServer();
