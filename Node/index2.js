const cors = require('cors');
const express = require('express');
const Node = require('./models/node');
const Transaction = require('./models/transaction');
const config = require('./config/config')
const request = require('request');


let http_port = process.env.HTTP_PORT || config.port;
let app = express();
app.use(cors());

let node = new Node(config.testUrl + '3009');
let tran1 = new Transaction();
let tran2 = new Transaction();
// node.chain.pendingTransactions.push(tran1);
// node.chain.pendingTransactions.push(tran2);

require('./config/body-parser')(app);
require('./config/routes')(app, node);

// TODO

app.listen(3009, () => {
    let peersToConnect = [];

    for (let i = 0; i < peersToConnect.length; i++) {
        let peerUrl = peersToConnect[i];
        request.post({
            url: peerUrl + '/peer-connect',
            form: {
                nodeId: node._id,
                nodeUrl: node.selfUrl
            }
        }, function (err, response, body) {
            let nodeId = JSON.parse(body).nodeId;

            node.peers.set(nodeId, peerUrl);
        });
    }

    setInterval(function () {
        node.peers.forEach(function (value, key, mapObj) {
            request.get(value + '/info', function (err, response, body) {
                if (err) {
                    console.log(err);
                } else {
                    node.chain.calculateCumulativeDifficulty();
                    let response = JSON.parse(body);
                    
                    let difficulty = +response.cumulativeDifficulty;
                    console.log('Received difficulty: ' + difficulty);
                    let ownChainDifficulty = node.chain.cumulativeDifficulty;
                    if (difficulty > ownChainDifficulty) {
                        request.get(value + '/blocks', function (err, response, body) {
                            
                            let blocks = JSON.parse(body);
                            console.log(blocks.length);
                            let checkDifficulty = node.checkCumulativeDifficulty(blocks, difficulty);
                            console.log()
                            console.log('Difficulty same: ' + checkDifficulty)
                            let isValidChain = node.validateBlocks(blocks);
                            console.log('Is the chain valid? -> ' + isValidChain)
                            if (checkDifficulty && isValidChain) {                            
                                node.chain.blocks = blocks;
                                node.chain.calculateCumulativeDifficulty();
                            }                            
                        })
                    }
                }
            })
        });
    }
    , 3000);
});