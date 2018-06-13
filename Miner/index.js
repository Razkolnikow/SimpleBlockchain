const express = require('express');
const Miner = require('./models/miner');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/get-mining-job', (req, res) => {
    let miner = new Miner();
    console.log('Calculating hash.')
    let blockHash = req.query.blockHash;
    let difficulty = +req.query.difficulty;
    if (!blockHash && isNaN(difficulty)) {
        res.json({error: 'Not valid parameters!'})
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
});

app.get('/test-miner', (req, res) => {
    res.send('Success!');
})

app.listen(3001);

