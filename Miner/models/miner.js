const CryptoJS = require('crypto-js');

module.exports = class Miner {
    constructor () {
        this.nonce = 0;
        this.timestamp = new Date();
        this.hash = '';
        this.minerAddress = 'test address';
    }

    calculateHash(blockHash, difficulty) {
        while(this.hash.toString().substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.hash = CryptoJS.SHA256(blockHash + this.nonce + this.timestamp);
            this.nonce++;
        }

        console.log('Mined block hash: ' + this.hash);
        return this.hash;
    }
}