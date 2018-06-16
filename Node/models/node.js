const Blockchain = require('./blockchain')

module.exports = class Node {
    constructor () {
        this._id = "test_uniqueId";
        this.selfUrl = '';
        this.peers = new Map(); // nodeId -> Url
        this.chain = new Blockchain();
    }

    // TODO: Notify peers when you receive new transaction!!!
    // send the transaction hash

    // TODO: Use Json representation of the block data for the hash !!!
    // TODO: The miner should sent the minedBlockHash with the block index in order for the node to check
    // if this block has been already mined or not !!!
    // Calculate cumulative difficulty!!!

    
}