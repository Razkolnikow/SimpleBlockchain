const Blockchain = require('./blockchain')
const config = require('./../config/config')
const ValidationUtil = require('./validationUtil');
const Transaction = require('./transaction');

module.exports = class Node {
    constructor () {
        this._id = (new Date()).getTime().toString(16) +
        Math.random().toString(16).substring(2);
        this.selfUrl = config.testUrl + config.port;
        this.peers = new Map(); // nodeId -> Url
        this.chain = new Blockchain();
    }    

    // TODO adjust difficulty - optional
    // TODO Get confirmed transaction endpoint
    // TODO Get pending transactions endpoint
    // TODO list all account balances

    addBlock(block) {
        let lastBlock = this.chain.blocks[this.chain.blocks.length - 1];
        block.prevBlockHash = lastBlock.minedBlockHash;
        this.chain.blocks.push(block);
    }

    processTransactions(block) {
        let transactions = block.transactions;
        for (let i = 0; i < transactions.length; i++) {
            let transaction = transactions[i];
            transaction.transferSuccessful = true;
            transaction.minedInBlockIndex = block.index;

            let index = this.chain.pendingTransactions.indexOf(transaction);
            this.chain.pendingTransactions.splice(index, 1);
        }
    }

    receiveTransaction(transaction, receivedTransactionHash) {
        console.log('in receive tran')
        let validationUtil = new ValidationUtil();
        let areValidFields = validationUtil
            .checkTransactionForInvalidFields(
                transaction, 
                receivedTransactionHash
            );

        console.log('are valid fields: ' + areValidFields);

        let isDuplicateTran = !!this.chain.pendingTransactions
            .find(x => x.transactionDataHash === receivedTransactionHash);
        
        if (areValidFields && transaction.validateTransaction() 
            && !isDuplicateTran && this.haveEnoughBalance(transaction)) {
            this.chain.pendingTransactions.push(transaction);
            return true;
        }

        return false;
    }

    haveEnoughBalance(tran) {
        let senderAddress = tran.from;
        let balance = this.getBalance(senderAddress);
        let value = +tran.value;
        return (balance - value) >= 0;
    }

    mapTran(tran, receivedTran) {
        tran.from = receivedTran.from;
        tran.to = receivedTran.to;
        tran.value = receivedTran.value;
        tran.fee = receivedTran.fee;
        tran.dateCreated = receivedTran.dateCreated;
        tran.data = receivedTran.data;
        tran.senderPubKey = receivedTran.senderPubKey;
        tran.calculateTransacionDataHash();
        tran.senderSignature = receivedTran.senderSignature;
    }

    getBalance(address) {
        // TODO - safe balance (6 blocks confirmation); confirmed balance (between 1 and 6 blocks depth)
        // pendingBalance - balance from pending transactions
        
        let blocks = this.chain.blocks;
        let balance = 0;
        
        for (let i = 0; i < blocks.length; i++) {
            let transactions = blocks[i].transactions;

            for (let j = 0; j < transactions.length; j++) {
                let currentTran = transactions[j];
                let val = +currentTran.value;
                let fee = +currentTran.fee;
                if (currentTran.to === address) {
                    balance += (val - fee);
                } else if (currentTran.from === address) {
                    balance -= (val);
                }
            }
        }
        
        return balance;
    }

    notifyPeersForNewTransactions() {
        // TODO: Notify peers when you receive new transaction!!!
        // send the transaction hash
        let pendingTrans = this.chain.pendingTransactions;
        let transactionsHashes = [];
        for (let i = 0; i < pendingTrans.length; i++) {
            transactionsHashes.push(pendingTrans[i].transactionDataHash);
        }

        return transactionsHashes;
    }

    giveTransactionsToPeer(wantedTransactionHashes) {
        let transactionsToSend = [];
        for (let i = 0; i < wantedTransactionHashes.length; i++) {
            let item = this.chain.pendingTransactions
                .find(x => x.transactionDataHash === wantedTransactionHashes[i]);
            if (item) {
                transactionsToSend.push(item);
            }
        }

        return transactionsToSend;
    }

    notifyPeersForMinedBlock(minedBlock) {
        // TODO

        for (let i = 0; i < this.peers.length; i++) {
            let currentPeer = this.peers[i];
            // TODO
        }
    }

    connectToPeers() {
        // TODO
    }

    checkForNewTransactions() {
        // TODO
    }

    syncChain(newChain) {

    }
    

    prepareCoinbaseTran (minerAddress, newBlock) {
        let transactions = newBlock.transactions;
        let fees = 0;
        for (let i = 0; i < transactions.length; i++) {
            fees += +transactions[i].fee;
        }

        let reward = transactions.length * 3;

        let tran = new Transaction();
        tran.from = null;
        tran.to = minerAddress;
        tran.value = (reward + fees);
        tran.fee = 0;
        tran.data = 'coinbase tran';
        tran.senderPubKey = null;
        tran.senderSignature = null;
        tran.transferSuccessful = true;
        tran.minedInBlockIndex = newBlock.index;

        return tran;
    }
}