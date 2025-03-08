const config = require("../config");
const logger = require("../utils/logger");

module.exports = function (io, socket, rooms) {
  socket.on(
    "createWebRtcTransport",
    async ({ roomId, consuming, producing }, callback) => {
      const room = rooms.get(roomId);
      if (!room) {
        return callback({ error: "Room does not exist" });
      }

      try {
        const { listenIps, initialAvailableOutgoingBitrate } =
          config.mediasoup.webRtcTransport;

        const transport = await room.router.createWebRtcTransport({
          listenIps,
          enableUdp: true,
          enableTcp: true,
          preferUdp: true,
          initialAvailableOutgoingBitrate,
          appData: { consuming, producing },
        });

        logger.info(
          `Transport created (${transport.id}) for peer ${socket.id}`
        );

        const peer = room.getPeer(socket.id);
        peer.addTransport(transport);

        transport.on("dtlsstatechange", (dtlsState) => {
          if (dtlsState === "closed") {
            transport.close();
            peer.removeTransport(transport.id);
          }
        });

        transport.on("close", () => {
          logger.info(`Transport closed (${transport.id})`);
        });

        callback({
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
        });
      } catch (error) {
        logger.error(`Error creating WebRTC transport: ${error.message}`);
        callback({ error: error.message });
      }
    }
  );

  socket.on(
    "connectWebRtcTransport",
    async ({ roomId, transportId, dtlsParameters }, callback) => {
      const room = rooms.get(roomId);
      if (!room) {
        return callback({ error: "Room does not exist" });
      }

      const peer = room.getPeer(socket.id);
      if (!peer) {
        return callback({ error: "Peer not found" });
      }

      const transport = peer.getTransport(transportId);
      if (!transport) {
        return callback({ error: "Transport not found" });
      }

      try {
        await transport.connect({ dtlsParameters });
        logger.info(`Transport connected (${transport.id})`);
        callback({ connected: true });
      } catch (error) {
        logger.error(`Error connecting transport: ${error.message}`);
        callback({ error: error.message });
      }
    }
  );
};
