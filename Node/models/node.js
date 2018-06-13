const Blockchain = require('./blockchain')

module.exports = class Node {
    constructor () {
        this._id = "test_uniqueId";
        this.selfUrl = '';
        this.peers = new Map(); // nodeId -> Url
        this.chain = new Blockchain();
    }
}