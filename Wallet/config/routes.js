const path = require('path');

module.exports = function (app) {
    // TODO 

    app.get('/index', (req, res) => {
        res.sendFile(path.join(__dirname+'/../views/index.html'));
    });
}