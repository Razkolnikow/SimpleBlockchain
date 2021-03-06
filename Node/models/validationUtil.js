const CryptoJS = require('crypto-js');
const Constants = require('./CustomConstants');

module.exports = class ValidationUtil {
    constructor () {

    }

    validateMinedBlockHash(block, minedHash, nonce) {
        let hash = CryptoJS.SHA256(block.blockDataHash + nonce).toString();
        let difficulty = block.difficulty;
        
        return minedHash === hash && minedHash.substring(0, difficulty) === Array(difficulty + 1).join("0");
    }

    checkTransactionForInvalidFields(transaction, transactionHash) {
        if ((transaction.from === Constants.faucetAddress 
            || (transaction.from === Constants.nullAddress && transaction.to === Constants.faucetAddress))
            && transactionHash === transaction.transactionDataHash) {
            return true;
        }
        if (!transaction.from || transaction.from === ''
            || !transaction.to || transaction.to === ''
            || Number.isNaN(+transaction.value) || +transaction.value <= +transaction.fee
            || Number.isNaN(+transaction.fee) || +transaction.fee < 10
            || !transaction.dateCreated || transaction.dateCreated === ''
            || !transaction.senderPubKey || transaction.senderPubKey === ''
            || !transaction.senderSignature || transaction.senderSignature === ''
            || transactionHash != transaction.transactionDataHash) {
            return false;
        }        

        return true;
    }

    checkSenderAccountBalance() {
        // TODO
    }
}