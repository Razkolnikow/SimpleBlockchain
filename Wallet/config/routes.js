const path = require('path');
const Wallet = require('./../models/wallet');
const request = require('request');

let walletObj = new Wallet();

module.exports = function (app) {
    // TODO 

    app.get('/balance', (req, res) => {
        res.sendFile(path.join(__dirname+'/../views/balance.html'));
    })

    app.get('/send', (req, res) => {
        res.sendFile(path.join(__dirname+'/../views/send-transaction.html'));
    });

    app.get('/open', (req, res) => {
        res.sendFile(path.join(__dirname+'/../views/open-wallet.html'));
    });

    app.get('/generate', (req, res) => {
        res.sendFile(path.join(__dirname+'/../views/generate-wallet.html'));
    })

    app.get('/index', (req, res) => {
        res.sendFile(path.join(__dirname+'/../views/index.html'));
    })

    app.post('/open-wallet', (req, res) => {
        let privateKey = req.body.privateKey;
        let wallet = {};
        try {
            wallet = walletObj.getWalletFromPrivateKey(privateKey);
        } catch(e) {
            wallet = {response: 'invalid private key'}
        }
        
        res.json(wallet);
    });

    app.get('/generate-wallet', (req, res) => {
        let wallet = walletObj.generateRandomHDWallet();
        let wallet2 = walletObj.getWalletFromPrivateKey(wallet.privateKey.substr(2));

        let w = {
            privateKey: wallet.privateKey.substr(2),
            mnemonic: wallet.mnemonic,
            publicKey: wallet2.publicKey,
            address: wallet2.address
        }

        res.json(w);
    });

    app.get('/get-balance', (req, res) => {
        let address = req.query.address;
        let nodeUrl = req.query.nodeUrl;

        request.get('')
    });
}