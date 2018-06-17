const Block = require('./block');
const Transaction = require('./transaction');

module.exports = class Blockchain {
    constructor () {
        this.blocks = [];
        this.pendingTransactions = [];
        this.currentDifficulty = 4;
        this.miningJobs = new Map(); // blockDataHash -> Block
        this.cumulativeDifficulty = 0;
        this._id = '';
        this.generateGenesisBlock();
    }

    generateGenesisBlock() {
        let genesisBlock = new Block();
        let transaction = new Transaction();
        transaction.from = '0000000000000000000000000000000000000000'
        transaction.to = 'faucete';
        transaction.dateCreated = new Date().toISOString();
        transaction.fee = 0;
        transaction.value = 1000000000000;
        transaction.transferSuccessful = true;
        transaction.data = 'genesis transaction';
        transaction.minedInBlockIndex = 0;
        transaction.senderPubKey = '00000000000000000000000000000000000000000000000000000000000000000';
        transaction.senderSignature = [
        "0000000000000000000000000000000000000000000000000000000000000000",
        "0000000000000000000000000000000000000000000000000000000000000000"
        ];
        genesisBlock.nonce = 0;
        genesisBlock.transactions.push(transaction);
        genesisBlock.prevBlockHash = '';
        genesisBlock.minedBy = '';
        genesisBlock.difficulty = 0;

        genesisBlock.blockDataHash = genesisBlock.calculateBlockHash();
        genesisBlock.minedBlockHash = genesisBlock.blockDataHash;
        this.blocks.push(genesisBlock);
        this._id = this.blocks[0].blockDataHash;
    }

    calculateCumulativeDifficulty() {
        this.cumulativeDifficulty = 0;
        for (let i = 0; i < this.blocks.length; i++) {
            let currentBlock = this.blocks[i];
            this.cumulativeDifficulty += Math.pow(16, currentBlock.difficulty);
        }
    }
}