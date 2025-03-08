const Room = require("../lib/room");
const Peer = require("../lib/peer");
const Worker = require("../lib/worker");
const logger = require("../utils/logger");

module.exports = function (io, socket, rooms) {
  socket.on("createRoom", async ({ roomId }, callback) => {
    if (rooms.has(roomId)) {
      return callback({ error: "Room already exists" });
    }
    logger.info(`Creating room: ${roomId}`);

    try {
      const worker = WorkerManager.getNextWorker();
      const room = new Room(roomId, worker);
      await room.init();
      rooms.set(roomId, room);
      callback({ roomId });
    } catch (error) {
      logger.error(`Error creating room: ${error}`);
      callback({ error: "Error creating room" });
    }
  });

  socket.on("joinRoom", async ({ roomId, name, supabaseUserId }, callback) => {
    const room = rooms.get(roomId);
    if (!room) {
      return callback({ error: "Room does not exist" });
    }
    logger.info(`User ${name} ${socket.id} joining room ${roomId}`);

    const peer = new Peer(socket.id, name, supabaseUserId);
    room.addPeer(peer);

    socket.join(roomId);

    const rtpCapabilities = room.router.rtpCapabilities;

    const producerList = room.getProducerListForPeer();

    callback({ rtpCapabilities, producerList });

    socket.to(roomId).emit("userJoined", {
      socketId: socket.id,
      name: name,
      supabaseUserId,
    });
  });

  socket.on("getRouterRtpCapabilities", ({ roomId }, callback) => {
    const room = rooms.get(roomId);
    if (!room) {
      return callback({ error: "Room does not exist" });
    }

    callback({ rtpCapabilities: room.router.rtpCapabilities });
  });

  socket.on("leaveRoom", ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const peer = room.getPeer(socket.id);
    if (!peer) return;

    logger.info(`User ${peer.name} (${socket.id}) leaving room ${roomId}`);

    peer.close();

    room.removePeer(socket.id);

    socket.to(roomId).emit("userLeft", { socketId: socket.id });

    socket.leave(roomId);

    if (room.peers.size === 0) {
      room.close();
      rooms.delete(roomId);
      logger.info(`Room ${roomId} deleted`);
    }
  });
};
