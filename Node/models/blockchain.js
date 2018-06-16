const Block = require('./block');
const Transaction = require('./transaction');

module.exports = class Blockchain {
    constructor () {
        this.blocks = [];
        this.pendingTransactions = [];
        this.currentDifficulty = 4;
        this.miningJobs = new Map(); // blockDataHash -> Block
        this.cumulativeDifficulty = 0;
    }

    calculateCumulativeDifficulty() {
        this.cumulativeDifficulty = 0;
        for (let i = 0; i < this.blocks.length; i++) {
            let currentBlock = this.blocks[i];
            this.cumulativeDifficulty += Math.pow(16, currentBlock.difficulty);
        }
    }
}