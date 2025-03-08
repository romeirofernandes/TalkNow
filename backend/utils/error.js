class MediasoupError extends Error {
  constructor(message, code = "MEDIASOUP_ERROR") {
    super(message);
    this.name = "MediasoupError";
    this.code = code;
  }
}

class RoomError extends Error {
  constructor(message, code = "ROOM_ERROR") {
    super(message);
    this.name = "RoomError";
    this.code = code;
  }
}

class TransportError extends Error {
  constructor(message, code = "TRANSPORT_ERROR") {
    super(message);
    this.name = "TransportError";
    this.code = code;
  }
}

module.exports = {
  MediasoupError,
  RoomError,
  TransportError,
};
