const mediasoup = require("mediasoup");
const config = require("../config");
const logger = require("./logger");

class WorkerManager {
  constructor() {
    this.workers = [];
    this.nextWorkerIndex = 0;
  }

  async createWorkers(numWorkers = Object.keys(require("os").cpus()).length) {
    logger.info(`Creating ${numWorkers} mediasoup workers...`);

    for (let i = 0; i < numWorkers; i++) {
      const worker = await mediasoup.createWorker({
        logLevel: config.mediasoup.worker.logLevel,
        logTags: config.mediasoup.worker.logTags,
        rtcMinPort: config.mediasoup.worker.rtcMinPort,
        rtcMaxPort: config.mediasoup.worker.rtcMaxPort,
      });

      worker.on("died", () => {
        logger.error(`Worker ${worker.pid} died, exiting...`);
        setTimeout(() => process.exit(1), 2000);
      });

      this.workers.push(worker);
      logger.info(
        `Worker ${i + 1}/${numWorkers} created with pid ${worker.pid}`
      );
    }

    return this.workers;
  }

  getNextWorker() {
    const worker = this.workers[this.nextWorkerIndex];
    this.nextWorkerIndex = (this.nextWorkerIndex + 1) % this.workers.length;

    return worker;
  }

  close() {
    for (const worker of this.workers) {
      worker.close();
    }

    this.workers = [];
    this.nextWorkerIndex = 0;
  }
}

module.exports = new WorkerManager();
