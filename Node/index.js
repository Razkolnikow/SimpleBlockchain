const cors = require('cors');
const express = require('express');
const Node = require('./models/node');
const Transaction = require('./models/transaction');


let http_port = process.env.HTTP_PORT || 3005;
let app = express();
app.use(cors());

let node = new Node();
let tran1 = new Transaction();
let tran2 = new Transaction();
node.chain.pendingTransactions.push(tran1);
node.chain.pendingTransactions.push(tran2);

require('./config/body-parser')(app);
require('./config/routes')(app, node);

// TODO

app.listen(http_port);