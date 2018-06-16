const express = require('express');
const Miner = require('./models/miner');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/get-mining-job', (req, res) => {
    let miner = new Miner();
    request.get('http://localhost:3005/get-mining-job', function (err, response, body) {
        let params = JSON.parse(body);
        let blockHash = params.blockDataHash;
        let difficulty = +params.difficulty;
        if (!blockHash && isNaN(difficulty)) {
            res.json(response)
        } else {
            let minedBlockHash = miner.calculateHash(blockHash, difficulty);
            res.json({
                minedBlockHash: minedBlockHash.toString(),
                blockHash: blockHash,
                nonce: miner.nonce,
                timestamp: miner.timestamp,
                awardAddress: miner.minerAddress
            });
        }    
    })    
});

app.get('/test-miner', (req, res) => {
    res.send('Success!');
})

app.listen(3004);

