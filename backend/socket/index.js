const socketIo = require("socket.io");
const config = require("../config");
const logger = require("../logger");
const roomEvents = require("./roomEvents");
const peerEvents = require("./peerEvents");
const transportEvents = require("./transportEvents");

const rooms = new Map();

function initializeSocketServer(server) {
  const io = socketIo(server, {
    cors: {
      origin: config.cors.origin,
      methods: config.cors.methods,
    },
  });

  io.on("connection", (socket) => {
    logger.info(`Client connected [id=${socket.id}]`);

    roomEvents(io, socket, rooms);
    peerEvents(io, socket, rooms);
    transportEvents(io, socket, rooms);

    socket.on("disconnect", () => {
      logger.info(`Client disconnected [id=${socket.id}]`);
      rooms.forEach((room) => {
        const peer = room.getPeer(socket.id);
        if (peer) {
          peer.close();
          room.removePeer(socket.id);
          socket.to(room.id).emit("User Left", {
            socketId: socket.id,
          });

          logger.info(`Peer ${socket.id} removed from room ${room.id}`);

          if (room.peers.size === 0) {
            room.close();
            rooms.delete(room.id);
            logger.info(`Room ${room.id} deleted`);
          }
        }
      });
    });
  });

  return io;
}

module.exports = {
    initializeSocketServer,
    getRooms : () => rooms
}
