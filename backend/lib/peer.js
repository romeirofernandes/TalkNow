class Peer{
    constructor(socketId, name, supabaseUserId = null){
        this.socketId = socketId;
        this.name = name;
        this.supabaseUserId = supabaseUserId;
        this.transports = new Map();
        this.producers = new Map();
        this.consumers = new Map();
        this.closed = false;
    }

    addTransport(transport){
        this.transports.set(transport.id, transport);
    }

    getTransport(transportId){
        return this.transports.get(transportId);
    }

    removeTransport(transportId){
        this.transports.delete(transportId);
    }

    addProducer(producer){
        this.producers.set(producer.id, producer);
    }

    getProducer(producerId){
        return this.producers.get(producerId);
    }

    removeProducer(producerId){
        this.producers.delete(producerId);
    }

    addConsumer(consumer){
        this.consumers.set(consumer.id, consumer);
    }

    getConsumer(consumerId){
        return this.consumers.get(consumerId);
    }

    removeConsumer(consumerId){
        this.consumers.delete(consumerId);
    }

    close(){
        if(this.closed){
            return;
        }
        this.closed = true;
        this.transports.forEach((transport) => {
            transport.close();
        });
        this.transports.clear();
        this.producers.clear();
        this.consumers.clear();
    }

    toJSON(){
        return {
            id: this.id,
            name: this.name,
            supabaseUserId: this.supabaseUserId,
            transportCount: this.transports.size,
            producerCount: this.producers.size,
            consumerCount: this.consumers.size,
        };
    }
}

module.exports = Peer;