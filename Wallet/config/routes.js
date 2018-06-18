const path = require('path');
const Wallet = require('./../models/wallet');

let walletObj = new Wallet();

module.exports = function (app) {
    // TODO 

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
        console.log(req.body);
        let privateKey = req.body.privateKey;
        let wallet = {};
        try {
            wallet = walletObj.getWalletFromPrivateKey(privateKey);
        } catch(e) {
            wallet = {response: 'invalid private key'}
        }
        
        res.json(wallet);
    });
}