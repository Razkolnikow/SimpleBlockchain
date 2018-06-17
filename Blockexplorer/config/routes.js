const Faucet = require('./../faucet/faucet');
const request = require('request');

module.exports = function (app) {
    app.get('/faucet-get-coins', (req, res) => {
        let receiverAddress = req.query.receiverAddress;
        let faucet = new Faucet();
        let transaction = faucet.send(receiverAddress);
        request.post({url: 'http://localhost:3005/send-transaction', 
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
}