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
        console.log(nodeUrl);

        request.get((nodeUrl + '/balance?address=' + address), function (error, response, body) {
            if (error) {
                res.json(error);
            } else {
                res.json(body);
            }                      
        })

        //res.json({err: "error occured"})
    });

    app.post('/send-transaction', (req, res) => {
        let from = req.body.from;
        let to = req.body.to;
        let value = req.body.value;
        let privateKey = req.body.privateKey;

        let nodeUrl = req.body.nodeUrl;
        let pubKey = walletObj.getPublicKeyFromPrivate(privateKey);

        

        let transaction = {
            from: from, // Address (40 hex digits)
            to: to, // Address (40 hex digits)
            value: value, // non negative integer
            fee: 10, //   non negative integer
            dateCreated: new Date().toISOString(), // String ISO8601_string
            data: '', // String optional
            senderPubKey: pubKey, 
            transactionDataHash: '', // Hex_number
            senderSignature: '', // hex number [2][64]
        }

        let transactionHash = walletObj.calculateTransacionDataHash(transaction);
        let signature = walletObj
            .sign(transactionHash, privateKey)
            .signature.toString('hex');
        transaction.transactionDataHash = transactionHash;
        transaction.senderSignature = signature;

        request.post({url: nodeUrl + '/send-transaction', 
        form: transaction}, function (err, response, body) {
            if (err) {
                res.json(err);
            } else {
                res.json(body);
            }
        });
    });
}