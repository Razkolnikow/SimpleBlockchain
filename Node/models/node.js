const Blockchain = require('./blockchain')
const config = require('./../config/config')

module.exports = class Node {
    constructor () {
        this._id = (new Date()).getTime().toString(16) +
        Math.random().toString(16).substring(2);
        this.selfUrl = config.testUrl + config.port;
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