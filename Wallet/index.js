const express = require('express');
const Wallet = require('./models/wallet');
const CryptoJS = require('crypto-js');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const js_sha3 = require('js-sha3');
const secp256k1 = require('secp256k1');
const RIPEMD160 = require('ripemd160');
const eu = require('ethereumjs-util');




    
