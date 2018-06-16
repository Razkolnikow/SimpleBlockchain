const cors = require('cors');
const express = require('express');

let http_port = process.env.HTTP_PORT || 3001;
let app = express();
app.use(cors());

app.get('/test', (req, res) => {
    res.send('current port: ' + http_port);
})



// TODO

app.listen(http_port);