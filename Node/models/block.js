const CryptoJS = require('crypto-js');

module.exports = class Block {
    constructor () {
        this.index = 0; // TODO Generate index
        this.transactions= [];
        this.difficulty = 4; // TODO
        this.prevBlockHash = '';
        this.minedBy = ''; // Miner address
        this.blockDataHash = ''; // When sending the blockdatahash and the difficulty the node
        // should send the index to the miner also, so the miner can check if there is newer blocks to mine

        // Values received from the miner
        this.nonce = 0;
        this.dateCreated = '';
        this.minedBlockHash = '';
    }

    calculateBlockHash() {
        return CryptoJS.SHA256(
            this.index +
            this.prevBlockHash + 
            this.difficulty +
            JSON.stringify(this.transactions) +
            this.minedBy
        );
    }
}