const cors = require('cors');
const express = require('express');
const Node = require('./models/node');


let http_port = process.env.HTTP_PORT || 3005;
let app = express();
app.use(cors());

let node = new Node();

require('./config/body-parser')(app);
require('./config/routes')(app, node);

// TODO

app.listen(http_port);