const express = require('express');
const Wallet = require('./models/wallet');
const CryptoJS = require('crypto-js');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const js_sha3 = require('js-sha3');
const secp256k1 = require('secp256k1');
const RIPEMD160 = require('ripemd160');
const eu = require('ethereumjs-util');

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
let address = eu.pubToAddress(derivedPubKey);

console.log(decompressedPubKey);
console.log(secp256k1.publicKeyConvert(publicKeyFromprivate, false))
console.log(pubKey);
console.log(derivedPubKey);
console.log('Is Valid: ' + walletObj.verifySignature(transactionHash, pubKey, sig));

console.log('Address: ' + address.toString('hex'));


    
