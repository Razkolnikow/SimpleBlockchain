const Blockchain = require('./blockchain')
const config = require('./../config/config')
const ValidationUtil = require('./validationUtil');
const Transaction = require('./transaction');
const Constants = require('./CustomConstants');

module.exports = class Node {
    constructor (url) {
        this._id = (new Date()).getTime().toString(16) +
        Math.random().toString(16).substring(2);
        this.selfUrl = url // config.testUrl + config.port;
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
            transaction.calculateTransacionDataHash();

            let index = this.chain.pendingTransactions.indexOf(transaction);
            this.chain.pendingTransactions.splice(index, 1);
        }
    }

    receiveTransaction(transaction, receivedTransactionHash) {
        console.log('in receive tran')
        let validationUtil = new ValidationUtil();
        transaction.calculateTransacionDataHash();
        let areValidFields = validationUtil
            .checkTransactionForInvalidFields(
                transaction, 
                receivedTransactionHash
            );

        let isDuplicateTran = !!this.chain.pendingTransactions
            .find(x => x.transactionDataHash === receivedTransactionHash);

        let isExistendNotPendingTran = this.checkIfTransactionExists(receivedTransactionHash);
        
        console.log('Duplicate tran: ' + isDuplicateTran)
        console.log('Already exists: ' + isExistendNotPendingTran);
        if (areValidFields && transaction.validateTransaction() 
            && !isDuplicateTran && this.haveEnoughBalance(transaction) && !isExistendNotPendingTran) {
            this.chain.pendingTransactions.push(transaction);
            return true;
        }

        return false;
    }

    checkIfTransactionExists(tranHash) {
        let blocks = this.chain.blocks;
        for (let i = 0; i < blocks.length; i++) {
            let currentBlock = blocks[i];
            let currentBlockTransactions = currentBlock.transactions;
            for (let j = 0; j < currentBlockTransactions.length; j++) {
                let currentTransaction = currentBlockTransactions[j];
                if (currentTransaction.transactionDataHash === tranHash) {
                    return true;
                }
            }
        }

        return false;
    }

    haveEnoughBalance(tran) {
        let senderAddress = tran.from;
        let balance = this.getBalance(senderAddress);
        let value = +tran.value;
        console.log('balance is: ' + (balance - value));
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
        tran.minedInBlockIndex = receivedTran.minedInBlockIndex;
        tran.transferSuccessful = receivedTran.transferSuccessful;
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

    packInfoToNotifyPeersForMinedBlock(minedBlock) {
        this.chain.calculateCumulativeDifficulty();
        let info = {
            blocksCount: this.chain.blocks.length,
            cumulativeDifficulty: this.chain.cumulativeDifficulty,
            nodeUrl: this.selfUrl
        }

        return info;
    }

    connectToPeers() {
        // TODO
    }

    checkForNewTransactions() {
        // TODO
    }

    syncChain(newChain) {

    }

    checkCumulativeDifficulty(blocks, givenDifficulty) {
        let cumulativeDifficulty = 0;
        for (let i = 0; i < blocks.length; i++) {
            let currentBlock = blocks[i];
            //console.log('Current block diff: ' + currentBlock.difficulty);
            console.log(currentBlock)
            cumulativeDifficulty += Math.pow(16, +currentBlock.difficulty);
        }

        console.log('Calculated cumulative diff: ' + cumulativeDifficulty);
        console.log('geven cumulative diff: ' + givenDifficulty);
        return cumulativeDifficulty === givenDifficulty;
    }

    validateBlocks(blocks) {        
        let hashes = new Set();
        let len = blocks.length;
        for (let i = 0; i < len; i++) {
            let current = blocks[i];
            let coinbaseTransactionsCounter = {
                count: 0
            };
            if (i < len - 1) {
                if (current.index + 1 !== blocks[i + 1].index
                    || blocks[i + 1].prevBlockHash !== current.minedBlockHash) {     
                        console.log('Problem in block prev hashes')                                       
                        return false;
                    }
            }

            let transactions = current.transactions;

            for (let j = 0; j < transactions.length; j++) {
                let tran = transactions[j];
                tran.value = +tran.value;
                tran.fee = +tran.fee;
                
                
                let transactionClass = new Transaction();
                this.mapTran(transactionClass, tran);
                let validFields = this
                    .validateTransactionFields(
                        transactionClass, 
                        tran.transactionDataHash, 
                        current.minedBy,
                        coinbaseTransactionsCounter
                    );

                if (!validFields) return false;
                let duplicateTran = hashes.has(tran.transactionDataHash);
                if (duplicateTran) {
                    console.log('---------------------------------------------------------')
                    console.log('---------------------------------------------------------')
                    console.log('---------------------------------------------------------')
                    console.log('---------------------------------------------------------')
                    console.log(tran.transactionDataHash)
                    console.log(tran)
                }
                if (duplicateTran) return false;
                hashes.add(tran.transactionDataHash);                
            }

            if (coinbaseTransactionsCounter.count > 1) {
                console.log('Problem in coinbase tran')    
                return false;
            }
        }
        
        return true;
    }

    validateTransactionFields(tran, hash, minedBy, coinbaseTransactionsCounter) {
        console.log(tran);
        let validationUtil = new ValidationUtil();
        // let hash = tran.transactionDataHash;
        tran.calculateTransacionDataHash();

        let isCoinbaseTransaction = this.checkIfCoinbaseTran(tran, minedBy);

        if (isCoinbaseTransaction) {
            coinbaseTransactionsCounter.count++;
            tran.transferSuccessful = true;
            return true;
        }

        let areValidFields = validationUtil.checkTransactionForInvalidFields(tran, hash);
        console.log(areValidFields);
        if (areValidFields) {
            tran.transferSuccessful = true;
        }

        if (!areValidFields) {
            console.log('------------------------------')
            console.log(tran)
            console.log('------------------------------')
        }
        
        return areValidFields;
    }

    checkIfCoinbaseTran(tran, minerAddress) {
        let data = tran.data;
        if (data === Constants.coinbaseTransactionData
            && tran.to === minerAddress) {
                return true;
        }

        return false;
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
        tran.dateCreated = new Date().toISOString();
        tran.senderPubKey = null;
        tran.senderSignature = null;
        tran.transferSuccessful = true;
        tran.minedInBlockIndex = newBlock.index;

        return tran;
    }
}