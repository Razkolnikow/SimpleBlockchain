const Block = require('./../models/block'); 

module.exports = function (app, node) {
    app.get('/info', (req, res) => {
        res.json({
            nodeId: node._id,
            nodeUrl: 'http://localhost:3001',
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
        if (!node.chain.pendingTransactions.length || node.chain.pendingTransactions.length < 2) {
            res.json({
                miningJob: 'No pending transactions at the moment'
            });
        } else {
            let newBlock = new Block();
            let lastBlock = node.chain.blocks[node.chain.blocks.length - 1];
            newBlock.prevBlockHash = lastBlock.blockDataHash;
            newBlock.index = lastBlock.index + 1;
            newBlock.transactions.push(...node.chain.pendingTransactions);
            res.json({
                blockDataHash: newBlock.calculateBlockHash(),
                difficulty: newBlock.difficulty
            })
        }
    });

    app.post('/mineBlock', (req, res) => {
        let blockHash = req.body.blockhash;
        
        res.json({
            
        })
    })
}