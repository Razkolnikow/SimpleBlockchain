const CryptoJS = require('crypto-js');

module.exports = class Miner {
    constructor () {
        this.nonce = 0;
        this.timestamp = new Date();
        this.hash = '';
        this.minerAddress = '1E1CF750C93bd5c8bFE54c02ca12918B7E166761';
        this.currentBlockHash = '';
    }

    // TODO: The miner should ask the node on every 2-3 seconds for example if there is a new block
    // when the node returns bigger block index, the miner should leave the block that it is mining at the moment
    // and asks for the new block hash, if the old block was mined already !!!
    // The miner should send the minedBlockHash with the block index!!!

    calculateHash(blockHash, difficulty) {
        this.currentBlockHash = blockHash;
        this.hash = '';
        while(this.hash.toString().substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = CryptoJS.SHA256(blockHash + this.nonce);            
        }

        console.log('Mined block hash: ' + this.hash);
        return this.hash;
    }
}