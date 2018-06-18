const express = require('express');
const Wallet = require('./models/wallet');
const CryptoJS = require('crypto-js');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const js_sha3 = require('js-sha3');
const secp256k1 = require('secp256k1');
const RIPEMD160 = require('ripemd160');
const eu = require('ethereumjs-util');
const config = require('./config/config');

const app = express();

require('./config/body-parser')(app);

require('./config/routes')(app);

let walletObj = new Wallet();

let wallet = walletObj.generateRandomHDWallet();

console.log(wallet);

let publicKeyFromprivate = secp256k1.publicKeyCreate(new Buffer(wallet.privateKey.substr(2), 'hex'), true);
// console.log('Pub Key: ' + publicKeyFromprivate.toString('hex'));

// console.log(wallet.address.length);
// console.log(publicKeyFromprivate.toString('hex').length);

// console.log(walletObj.getWalletFromPrivateKey('6c8e66cc0dd5b5d6982ca9a869a6f546988f47d965bc4a4633b3a4b016b0b479'))

app.listen(config.port);





    
