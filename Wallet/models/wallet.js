const ethers = require('ethers');
const CryptoJS = require('crypto-js');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const secp256k1 = require('secp256k1');
const eu = require('ethereumjs-util');

module.exports = class Wallet {
    constructor () {

    }

    createRandomWallet() {
        return new ethers.Wallet.createRandom();
    }

    saveWalletToJson(wallet, password) {
        return wallet
            .encrypt(password)
            //.then(console.log);
    }

    getWalletFromJSON(json, password) {
        return ethers.Wallet.fromEncryptedWallet(json, password);
    }

    generateMnemonic () {
        let randomEntropyBytes = ethers.utils.randomBytes(16);
        return ethers.HDNode.entropyToMnemonic(randomEntropyBytes);
    }

    generateRandomHDWallet() {
        return ethers.Wallet.createRandom();
    }

    decryptWallet(json, password) {
        return ethers.Wallet.fromEncryptedWallet(json, password);
    }

    restoreHDWallet (mnemonic) {
        return ethers.Wallet.fromMnemonic(mnemonic);
    }

    deriveNWalletsFromHDNode(mnemonic, derivationPath, n) {
        let wallets = [];
    
        for (let i = 0; i < n; i++) {
            let hdNode = ethers.HDNode.fromMnemonic(mnemonic).derivePath(derivationPath + i);
            console.log(hdNode);
    
            let wallet = new ethers.Wallet(hdNode.privateKey);
            wallets.push(wallet);
        }
        
        return wallets;
    }



    sign(transactionHash, privateKey) {
        return secp256k1.sign(new Buffer(transactionHash, 'hex'), new Buffer(privateKey, 'hex'));
    }

    verifySignature(data, publicKey, signature) {
        // The node should verify the signature
        let result = secp256k1.verify(
            new Buffer(data, 'hex'), 
            new Buffer(signature,'hex'), 
            new Buffer(publicKey, 'hex'));
    
        return result;
    }

    getWalletFromPrivateKey(privateKey) {
        let publicKeyFromprivate = secp256k1.publicKeyCreate(new Buffer(privateKey, 'hex'), true);
        let decompressedPubKey = secp256k1.publicKeyConvert(publicKeyFromprivate, false);
        let address = eu.pubToAddress(new Buffer(decompressedPubKey.toString('hex').substr(2), 'hex'));

        return {
            publicKey: publicKeyFromprivate.toString('hex').substr(2),
            address: address.toString('hex')
        };
    }
}