const Block = require('./../models/block'); 
const ValidationUtil = require('./../models/validationUtil');
const Transaction = require('./../models/transaction');
let validationUtil = new ValidationUtil();

module.exports = function (app, node) {
    app.get('/info', (req, res) => {
        res.json({
            nodeId: node._id,
            nodeUrl: node.selfUrl,
            chainId: node.chain._id,
            currentDifficulty: node.chain.currentDifficulty,
            peers: node.peers.length ? node.peers.length : 0,
            blocksCount: node.chain.blocks.length
        })
    });

    app.get('/blocks', (req, res) => {
        res.json({
            blocks: node.chain.blocks
        })
    });

    app.get('/get-mining-job', (req, res) => {
        if (!node.chain.pendingTransactions.length || node.chain.pendingTransactions.length < 1) {
            res.json({
                miningJob: 'No pending transactions at the moment'
            });
        } else {
            let newBlock = new Block();
            let lastBlock = node.chain.blocks[node.chain.blocks.length - 1];
            newBlock.prevBlockHash = lastBlock.blockDataHash;
            newBlock.index = lastBlock.index + 1;
            let pendingTrans = node.chain.pendingTransactions;
            newBlock.transactions.push(...pendingTrans);
            newBlock.blockDataHash = newBlock.calculateBlockHash();
            // TODO Add the coinbase transaction to the block!!!

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
        // console.log(blockHash);
        // console.log(blockDataHash);
        let successful = false;
        block = node.chain.miningJobs.get(blockDataHash);
        console.log(blockDataHash);
        var lastBlock = node.chain.blocks[node.chain.blocks.length - 1];
        let isMinedHashValid = validationUtil.validateMinedBlockHash(block, blockHash, nonce);
        if (block && (block.index - 1) === lastBlock.index && isMinedHashValid) {
            successful = true;
            node.addBlock(block);
            node.processTransactions(block);
        }

        res.json({
            response: 'Mined block : ' + successful
        })
    })

    app.post('/send-transaction', (req, res) => {
        // TODO
        let receivedTran = req.body;
        let tran = new Transaction();
        node.mapTran(tran, receivedTran);

        // console.log(receivedTran);
        // console.log(tran);
        
        let isValid = node.receiveTransaction(tran, receivedTran.transactionDataHash);
        if (isValid) {
            res.json({response: 'Valid transaction'})
        } else {
            res.json({response: 'Invalid transaction'})
        }        
    });

    app.get('/blocks', (req, res) => {
        // TODO
    });
}