const path = require('path');

module.exports = function (app) {
    // TODO 

    app.get('/send', (req, res) => {
        res.sendFile(path.join(__dirname+'/../views/send-transaction.html'));
    });

    app.get('/generate', (req, res) => {
        res.sendFile(path.join(__dirname+'/../views/generate-wallet.html'));
    })

    app.get('/index', (req, res) => {
        res.sendFile(path.join(__dirname+'/../views/index.html'));
    })

    
}