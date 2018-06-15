const CryptoJS = require('crypto-js');

module.exports = class Miner {
    constructor () {
        this.nonce = 0;
        this.timestamp = new Date();
        this.hash = '';
        this.minerAddress = 'test address';
    }

    // TODO: The miner should ask the node on every two seconds for example if there is a new block
    // when the node returns bigger block index, the miner should leave the block that it is mining at the moment
    // and asks for the new block hash, if the old block was mined already !!!
    // The miner should send the minedBlockHash with the block index!!!

    calculateHash(blockHash, difficulty) {
        while(this.hash.toString().substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.hash = CryptoJS.SHA256(blockHash + this.nonce + this.timestamp);
            this.nonce++;
        }

        console.log('Mined block hash: ' + this.hash);
        return this.hash;
    }
}