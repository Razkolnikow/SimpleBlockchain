const Blockchain = require('./blockchain')
const config = require('./../config/config')
const ValidationUtil = require('./validationUtil');

module.exports = class Node {
    constructor () {
        this._id = (new Date()).getTime().toString(16) +
        Math.random().toString(16).substring(2);
        this.selfUrl = config.testUrl + config.port;
        this.peers = new Map(); // nodeId -> Url
        this.chain = new Blockchain();
    }    

    // TODO: Use Json representation of the block data for the hash !!!
    // TODO: The miner should sent the minedBlockHash with the block index in order for the node to check
    // if this block has been already mined or not !!!
    // Calculate cumulative difficulty!!!

    addBlock(block) {
        let lastBlock = this.chain.blocks[this.chain.blocks.length - 1];
        block.prevBlockHash = lastBlock.minedBlockHash;
        this.chain.blocks.push(block);
    }

    processTransactions(block) {
        let transactions = block.transactions;
        for (let i = 0; i < transactions.length; i++) {
            transactions[i].transferSuccessful = true;
            transactions[i].minedInBlockIndex = block.index;
        }
    }

    receiveTransaction(transaction, receivedTransactionHash) {
        let validationUtil = new ValidationUtil();
        let areValidFields = validationUtil
            .checkTransactionForInvalidFields(
                transaction, 
                receivedTransactionHash
            );
        
        if (areValidFields && transaction.validateTransaction()) {
            this.chain.pendingTransactions.push(transaction);
            return true;
        }

        return false;
    }

    notifyPeersForNewTransactions() {
        // TODO: Notify peers when you receive new transaction!!!
        // send the transaction hash
    }

    notifyPeersForMinedBlock() {
        // TODO
    }
}