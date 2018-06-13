const Block = require('./block');
const Transaction = require('./transaction');

module.exports = class Blockchain {
    constructor () {
        this.blocks = [];
        this.pendingTransactions = [];
        this.currentDifficulty = 4;
        this.miningJobs = new Map(); // blockDataHash -> Block
    }
}