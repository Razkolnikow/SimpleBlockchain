const express = require('express');
const Miner = require('./models/miner');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
let miner = new Miner();
function mine() {    
    request.get('http://localhost:3005/get-mining-job', function (err, response, body) {
        let params = JSON.parse(body);
        let blockHash = params.blockDataHash;
        let difficulty = +params.difficulty;
        if (!blockHash && isNaN(difficulty)) {
            console.log(body)
        } else {
            let minedBlockHash = miner.calculateHash(blockHash, difficulty);
            miner.timestamp = new Date();
            // res.json({
            //     minedBlockHash: minedBlockHash.toString(),
            //     blockHash: blockHash,
            //     nonce: miner.nonce,
            //     timestamp: miner.timestamp,
            //     awardAddress: miner.minerAddress
            // });
            console.log({
                    minedBlockHash: minedBlockHash.toString(),
                    blockHash: blockHash,
                    nonce: miner.nonce,
                    timestamp: miner.timestamp,
                    awardAddress: miner.minerAddress
                });
            request.post({url: 'http://localhost:3005/mineBlock', 
            form: {
                blockhash: minedBlockHash.toString(), 
                blockDataHash: blockHash,
                nonce: miner.nonce,
                dateCreated: miner.timestamp
            }},
             (err, response, body) => {
                 if (err) {
                     console.log('error: ' + err);
                 } else {
                    console.log(body);
                 }                
             });
        }    
    })   
}

// app.get('/get-mining-job', (req, res) => {
//     mine();
// });

app.get('/test-miner', (req, res) => {
    res.send('Success!');
})

app.listen(3004, () => {
    setInterval(function () {
        mine();
    }
    , 3000);
});

