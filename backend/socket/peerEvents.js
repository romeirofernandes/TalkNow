const logger = require('../utils/logger');

module.exports = function(io, socket, rooms) {
  socket.on('produce', async ({ roomId, transportId, kind, rtpParameters, appData }, callback) => {
    const room = rooms.get(roomId);
    if (!room) {
      return callback({ error: 'Room does not exist' });
    }

    const peer = room.getPeer(socket.id);
    if (!peer) {
      return callback({ error: 'Peer not found' });
    }

    const transport = peer.getTransport(transportId);
    if (!transport) {
      return callback({ error: 'Transport not found' });
    }

    try {
      const producer = await transport.produce({
        kind,
        rtpParameters,
        appData
      });

      peer.addProducer(producer);

      logger.info(`Producer created (${producer.id}) for peer ${peer.name} (${socket.id})`);
      socket.to(roomId).emit('newProducer', {
        producerId: producer.id,
        producerSocketId: socket.id,
        kind: producer.kind,
        appData
      });

      producer.on('transportclose', () => {
        producer.close();
        peer.removeProducer(producer.id);
      });

      callback({ id: producer.id });
    } catch (error) {
      logger.error(`Error producing: ${error.message}`);
      callback({ error: error.message });
    }
  });

  socket.on('consume', async ({ roomId, producerId, rtpCapabilities }, callback) => {
    const room = rooms.get(roomId);
    if (!room) {
      return callback({ error: 'Room does not exist' });
    }

    if (!room.router.canConsume({
      producerId,
      rtpCapabilities
    })) {
      return callback({ error: 'Cannot consume this producer' });
    }

    const peer = room.getPeer(socket.id);
    if (!peer) {
      return callback({ error: 'Peer not found' });
    }

    let producerOwner = null;
    let producer = null;

    room.peers.forEach(p => {
      p.producers.forEach(prod => {
        if (prod.id === producerId) {
          producerOwner = p;
          producer = prod;
        }
      });
    });

    if (!producerOwner || !producer) {
      return callback({ error: 'Producer not found' });
    }

    try {
      let consumerTransport = null;
      peer.transports.forEach(transport => {
        if (transport.appData.consuming) {
          consumerTransport = transport;
        }
      });

      if (!consumerTransport) {
        return callback({ error: 'Consumer transport not found' });
      }

      const consumer = await consumerTransport.consume({
        producerId,
        rtpCapabilities,
        paused: true 
      });

      peer.addConsumer(consumer);

      logger.info(`Consumer created (${consumer.id}) for peer ${peer.name} (${socket.id})`);

      consumer.on('transportclose', () => {
        consumer.close();
        peer.removeConsumer(consumer.id);
      });

      consumer.on('producerclose', () => {
        socket.emit('producerClosed', { consumerId: consumer.id });
        consumer.close();
        peer.removeConsumer(consumer.id);
      });

      const params = {
        id: consumer.id,
        producerId,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
        producerSocketId: producerOwner.id,
        producerName: producerOwner.name,
        appData: producer.appData
      };

      callback(params);
    } catch (error) {
      logger.error(`Error consuming: ${error.message}`);
      callback({ error: error.message });
    }
  });

  socket.on('resumeConsumer', async ({ roomId, consumerId }, callback) => {
    const room = rooms.get(roomId);
    if (!room) {
      return callback({ error: 'Room does not exist' });
    }

    const peer = room.getPeer(socket.id);
    if (!peer) {
      return callback({ error: 'Peer not found' });
    }

    const consumer = peer.getConsumer(consumerId);
    if (!consumer) {
      return callback({ error: 'Consumer not found' });
    }

    try {
      await consumer.resume();
      callback({ resumed: true });
    } catch (error) {
      logger.error(`Error resuming consumer: ${error.message}`);
      callback({ error: error.message });
    }
  });

  socket.on('pauseConsumer', async ({ roomId, consumerId }, callback) => {
    const room = rooms.get(roomId);
    if (!room) {
      return callback({ error: 'Room does not exist' });
    }

    const peer = room.getPeer(socket.id);
    if (!peer) {
      return callback({ error: 'Peer not found' });
    }

    const consumer = peer.getConsumer(consumerId);
    if (!consumer) {
      return callback({ error: 'Consumer not found' });
    }

    try {
      await consumer.pause();
      callback({ paused: true });
    } catch (error) {
      logger.error(`Error pausing consumer: ${error.message}`);
      callback({ error: error.message });
    }
  });
};
