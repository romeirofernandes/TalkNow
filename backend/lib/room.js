class Room {
  constructor(roomId, worker) {
    this.id = roomId;
    this.worker = worker;
    this.router = null;
    this.peers = new Map();
    this.closed = false;
  }
  async init() {
    const mediaCodecs = require("../config").mediasoup.router.mediaCodecs;
    this.router = await this.worker.createRouter({ mediaCodecs });
    return this.router;
  }

  addPeer(peer) {
    this.peers.set(peer.id, peer);
  }
  getPeer(peerId) {
    return this.peers.get(peerId);
  }
  removePeer(peerId) {
    this.peers.delete(peerId);
  }
  getProducerListForPeer() {
    const producerList = [];
    this.peers.forEach((peer) => {
      peer.producers.forEach((producer) => {
        producerList.push({
          producerId: producer.id,
          producerSocketId: peer.id,
          kind: producer.kind,
          appData: producer.appData,
        });
      });
    });
    return producerList;
  }
  close() {
    if (this.closed) {
      return;
    }
    this.closed = true;
    this.peers.forEach((peer) => {
      peer.close();
    });
    this.peers.clear();

    if (this.router) {
      this.router.close();
    }
    this.router = null;
    this.worker = null;
  }

  toJSON() {
    return {
      id: this.id,
      peerCount: this.peers.size,
    };
  }
}

module.exports = Room;
