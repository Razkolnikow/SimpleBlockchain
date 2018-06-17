const secp256k1 = require('secp256k1');
const CryptoJS = require('crypto-js');

module.exports = class Faucet {
    constructor () {
        // TODO validation for addresses requesting coins
        this.addresses = new Map(); // address -> date
        this.selfAddress = 'CFd4a0A452E49FA91C34f80B9C5aA95e6Da18F6B';
        this.privateKey = '83e3c4a7dbd53f0d44ccddd2cc592f6ec5a0342de3080e3504dab47fd8cc8149';
    }

    send(receiverAddress) {
        let pubKey = this.getPublicKey(this.privateKey);
        
        let transaction = {
            from: this.selfAddress, // Address (40 hex digits)
            to: receiverAddress, // Address (40 hex digits)
            value: 20, // non negative integer
            fee: 10, //   non negative integer
            dateCreated: new Date().toISOString(), // String ISO8601_string
            data: '', // String optional
            senderPubKey: pubKey, 
            transactionDataHash: '', // Hex_number
            senderSignature: '', // hex number [2][64]
        }

        transaction.transactionDataHash = this.calculateTransacionDataHash(transaction);
        transaction.senderSignature = this
            .sign(transaction.transactionDataHash, this.privateKey)
            .signature.toString('hex');

        return transaction;
    }

    sign(transactionHash, privateKey) {
        return secp256k1.sign(new Buffer(transactionHash, 'hex'), new Buffer(privateKey, 'hex'));
    }

    getPublicKey(privateKey) {
        let pubKey = secp256k1
            .publicKeyCreate(new Buffer(privateKey, 'hex'), true)
            .toString('hex');

        return pubKey;
    }

    calculateTransacionDataHash(transaction) {
        return CryptoJS.SHA256(transaction.from
            + transaction.to
            + transaction.value
            + transaction.fee
            + transaction.dateCreated
            + transaction.data
            + transaction.senderPubKey
        ).toString();
    }
}