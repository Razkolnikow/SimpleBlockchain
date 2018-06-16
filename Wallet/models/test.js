const express = require('express');
const Wallet = require('./wallet');
const CryptoJS = require('crypto-js');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const js_sha3 = require('js-sha3');
const secp256k1 = require('secp256k1');
const RIPEMD160 = require('ripemd160');
const eu = require('ethereumjs-util');

class Transaction {
    constructor (from, senderPubKey) {
        // TODO
        this.from = from; // Address (40 hex digits)
        this.to = ''; // Address (40 hex digits)
        this.value = 2; // non negative integer
        this.fee = ''; //   non negative integer
        this.dateCreated = ''; // String ISO8601_string
        this.data = ''; // String optional
        this.senderPubKey = senderPubKey; // hex number 65
        this.transactionDataHash = ''; // Hex_number
        this.senderSignature = ''; // hex number [2][64]
        this.minedInBlockIndex = ''; // integer
        this.transferSuccessful = ''; // bool
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
        let isValidSignature = this
            .verifySignature(this.transactionDataHash, this.senderPubKey, this.senderSignature);

        let isValuePositive = this.value > 0;

        // TODO check the fee also!!!
        if (isValidSignature && this.areAddressAndPublicKeyValid() 
            && isValuePositive) {
                
            return true;
        }       

        return false;
    }

    areAddressAndPublicKeyValid() {
        let decompressedPubKey = secp256k1.publicKeyConvert(this.senderPubKey, false);
        let address = eu.pubToAddress(new Buffer(decompressedPubKey.toString('hex').substr(2), 'hex'));
        if (address.toString('hex').toLowerCase() !== this.from.substr(2).toLowerCase()) {
            return false;
        }

        return true;
    }

    verifySignature(data, publicKey, signature) {
        let result = secp256k1.verify(
            new Buffer(data, 'hex'), 
            new Buffer(signature,'hex'), 
            new Buffer(publicKey, 'hex'));
    
        return result;
    }
}

let walletObj = new Wallet();

let wallet = walletObj.generateRandomHDWallet();

// let wallets = walletObj.deriveNWalletsFromHDNode(wallet.mnemonic, wallet.path, 4);
// console.log(wallets);

let transaction = {
    data: 'some data',
    val: 54,
};

console.log(wallet);
let transactionHash = CryptoJS.SHA256(JSON.stringify(transaction)).toString();
let signature = walletObj.sign(transactionHash, wallet.privateKey.substr(2));
let sig = signature.signature.toString('hex');
console.log(sig);

let pubKey = secp256k1.recover(new Buffer(transactionHash, 'hex'), new Buffer(sig, 'hex'), signature.recovery);
console.log(pubKey.toString('hex'));

let publicKeyFromprivate = secp256k1.publicKeyCreate(new Buffer(wallet.privateKey.substr(2), 'hex'), true);
console.log('Pub Key: ' + publicKeyFromprivate.toString('hex'));
console.log('PubKey recovery: ' + pubKey.toString('hex'))

let decompressedPubKey = secp256k1.publicKeyConvert(pubKey, false);
let derivedPubKey = eu.privateToPublic(new Buffer(wallet.privateKey.substr(2), 'hex'));
let address = eu.pubToAddress(new Buffer(decompressedPubKey.toString('hex').substr(2), 'hex'));

console.log(decompressedPubKey.toString('hex').substr(2));
console.log(secp256k1.publicKeyConvert(publicKeyFromprivate, false).toString('hex').substr(2))
console.log(derivedPubKey.toString('hex'));
console.log('Is Valid: ' + walletObj.verifySignature(transactionHash, pubKey, sig));

console.log('Address: ' + address.toString('hex'));


let transaction1 = new Transaction(wallet.address, pubKey);

transaction1.calculateTransacionDataHash();

let signature2 = walletObj.sign(transaction1.transactionDataHash, wallet.privateKey.substr(2));
let sig2 = signature2.signature.toString('hex');
transaction1.senderSignature = sig2;
console.log(transaction1.areAddressAndPublicKeyValid());

console.log(transaction1.validateTransaction())