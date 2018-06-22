const Faucet = require('./../faucet/faucet');
const request = require('request');
const path = require('path');

module.exports = function (app) {
    app.post('/faucet-get-coins', (req, res) => {
        let receiverAddress = req.body.receiverAddress;
        let nodeUrl = req.body.nodeUrl;
        let faucet = new Faucet();
        let transaction = faucet.send(receiverAddress);
        request.post({url: `${nodeUrl}/send-transaction`, 
            form: transaction},
             (err, response, body) => {
                 if (err) {
                     res.send('ERROR');
                 } else {
                     res.send(body);
                 }
                console.log(body);
             });
    })

    app.get('/index', (req, res) => {
        res.sendFile(path.join(__dirname+'/../views/index.html'));
    })

    app.get('/blocks', (req, res) => {
        res.sendFile(path.join(__dirname+'/../views/blocks.html'));
    })

    app.get('/pending-transactions', (req, res) => {
        res.sendFile(path.join(__dirname+'/../views/pending.html'));
    })

    app.get('/faucet', (req, res) => {
        res.sendFile(path.join(__dirname+'/../views/faucet.html'));
    })

    app.get('/info', (req, res) => {
        res.sendFile(path.join(__dirname+'/../views/info.html'));
    })
}