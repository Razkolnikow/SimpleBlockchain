const Block = require('./../models/block'); 
const ValidationUtil = require('./../models/validationUtil');
const Transaction = require('./../models/transaction');
let request = require('request');
let validationUtil = new ValidationUtil();

module.exports = function (app, node) {

    function notifyAllPeersForNewTransaction (transaction) {
        node.peers.forEach (function (value, key, mapObj) {
            if (value !== node.selfUrl) {
                request.post({url: (value + '/send-transaction'), 
                form: transaction}, function (err, response, body) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(body);
                    }
                })
            }
        });
        
    }

    app.get('/info', (req, res) => {
        node.chain.calculateCumulativeDifficulty();
        res.json({
            nodeId: node._id,
            nodeUrl: node.selfUrl,
            chainId: node.chain._id,
            currentDifficulty: node.chain.currentDifficulty,
            peers: node.peers.size ? node.peers.size : 0,
            blocksCount: node.chain.blocks.length,
            cumulativeDifficulty: node.chain.cumulativeDifficulty
        })
    });

    app.post('/notify-new-block', (req, res) => {
        // TODO
    })

    app.get('/blocks', (req, res) => {
        res.json(node.chain.blocks)
    });

    app.get('/get-mining-job', (req, res) => {
        if (!node.chain.pendingTransactions.length || node.chain.pendingTransactions.length < 1) {
            res.json({
                miningJob: 'No pending transactions at the moment'
            });
        } else {
            let minerAddress = req.query.minerAddress;
            let newBlock = new Block();
            let lastBlock = node.chain.blocks[node.chain.blocks.length - 1];
            newBlock.prevBlockHash = lastBlock.blockDataHash;
            newBlock.index = lastBlock.index + 1;
            let pendingTrans = node.chain.pendingTransactions;
            newBlock.transactions.push(...pendingTrans);
            newBlock.blockDataHash = newBlock.calculateBlockHash();
            // TODO Add the coinbase transaction to the block!!!

            let coinbaseTran = node.prepareCoinbaseTran(minerAddress, newBlock);
            newBlock.transactions.push(coinbaseTran);

            node.chain.miningJobs.set(newBlock.blockDataHash, newBlock);
            
            res.json({
                blockDataHash: newBlock.blockDataHash,
                difficulty: newBlock.difficulty
            })
        }
    });

    app.post('/mineBlock', (req, res) => {
        let blockHash = req.body.blockhash;
        let blockDataHash = req.body.blockDataHash;
        let nonce = req.body.nonce;
        let dateCreated = req.body.timestamp;
        let minerAddress = req.body.minerAddress;
        // console.log(blockHash);
        // console.log(blockDataHash);
        let successful = false;
        block = node.chain.miningJobs.get(blockDataHash);
        block.nonce = nonce;
        block.minedBlockHash = blockHash;
        block.dateCreated = dateCreated;
        
        console.log();
        var lastBlock = node.chain.blocks[node.chain.blocks.length - 1];
        let isMinedHashValid = validationUtil.validateMinedBlockHash(block, blockHash, nonce);
        
        if (block && (block.index - 1) === lastBlock.index && isMinedHashValid) {
            successful = true;
            block.minedBy = minerAddress;
            node.addBlock(block);
            node.processTransactions(block);

            // TODO notify peers about the new block !!!

            res.json({
                response: 'Mined block : ' + successful
            })
        } else {
            res.json({
                response: "Invalid block"
            });
        }

        
    })

    app.post('/send-transaction', (req, res) => {
        // TODO
        let receivedTran = req.body;
        let tran = new Transaction();
        node.mapTran(tran, receivedTran);
        
        let isValid = node.receiveTransaction(tran, receivedTran.transactionDataHash);
        if (isValid) {
            // send transaction to all peers
            notifyAllPeersForNewTransaction(receivedTran);
            console.log('valid tran');
            res.json({response: 'Valid transaction'})
        } else {
            res.json({response: 'Invalid transaction'})
        }        
    });

    app.get('/blocks', (req, res) => {
        // TODO
    });

    app.get('/balance', (req, res) => {
        let address = req.query.address;
        let balance = node.getBalance(address);

        res.json({balance: balance});
    });

    app.get('/pending-transactions', (req, res) => {
        let pendingTransactions = node.chain.pendingTransactions;

        res.json(pendingTransactions);
    })

    app.post('/peer-connect', (req, res) => {
        let nodeId = req.body.nodeId;
        let nodeUrl = req.body.nodeUrl;

        node.peers.set(nodeId, nodeUrl);

        res.json({ response: "Connected", nodeId: node._id });
    });
}