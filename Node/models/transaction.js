const eu = require('ethereumjs-util');
const secp256k1 = require('secp256k1');
const CryptoJS = require('crypto-js')

module.exports = class Transaction {
    constructor () {
        // TODO
        this.from = ''; // Address (40 hex digits)
        this.to = ''; // Address (40 hex digits)
        this.value = 0; // non negative integer
        this.fee = 0; //   non negative integer
        this.dateCreated = ''; // String ISO8601_string
        this.data = ''; // String optional
        this.senderPubKey = ''; // hex number 65
        this.transactionDataHash = ''; // Hex_number
        this.senderSignature = ''; // hex number [2][64]
        this.minedInBlockIndex = ''; // integer
        this.transferSuccessful = false; // bool
    }

    calculateTransacionDataHash() {
        this.transactionDataHash = CryptoJS.SHA256(this.from
            + this.to
            + this.value
            + this.fee
            + this.dateCreated
            + this.data
            + this.senderPubKey
        ).toString();
    }

    validateTransaction() {
        console.log(this.senderPubKey);
        let isValidSignature = this
            .verifySignature(this.transactionDataHash, this.senderPubKey, this.senderSignature);

        let isValuePositive = this.value > 0;

        // TODO check the fee also!!!
        
        if (!isValidSignature || !this.checkAddress() 
            || !isValuePositive) {
            return false;
        }       

        return true;
    }

    checkAddress() {
        let decompressedPubKey = secp256k1.publicKeyConvert(new Buffer(this.senderPubKey, 'hex'), false);
        let address = eu.pubToAddress(new Buffer(decompressedPubKey.toString('hex').substr(2), 'hex'));
        if (this.from.startsWith('0x')) {
            this.from = this.from.substr(2);
        }
        if (address.toString('hex').toLowerCase() !== this.from.toLowerCase()) {
            console.log('Address is not valid maybe?')
            return false;
        }

        return true;
    }

    verifySignature(data, publicKey, signature) {
        let result = secp256k1.verify(
            new Buffer(data, 'hex'), 
            new Buffer(signature,'hex'), 
            new Buffer(publicKey, 'hex'));

            console.log('IsValid sig: ' + result);
    
        return result;
    }
}