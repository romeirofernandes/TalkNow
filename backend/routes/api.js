const express = require("express");
const router = express.Router();
const { getRooms } = require("../socket");
const logger = require("../utils/logger");

router.get("/rooms", (req, res) => {
  const rooms = getRooms();
  const roomList = [];

  rooms.forEach((room, id) => {
    roomList.push({
      id,
      peerCount: room.peers.size,
    });
  });

  res.json({ rooms: roomList });
});

router.get("/rooms/:roomId", (req, res) => {
  const rooms = getRooms();
  const room = rooms.get(req.params.roomId);

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  const peers = [];
  room.peers.forEach((peer) => {
    peers.push({
      id: peer.id,
      name: peer.name,
    });
  });

  res.json({
    id: room.id,
    peers,
  });
});

router.use((req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

module.exports = router;
