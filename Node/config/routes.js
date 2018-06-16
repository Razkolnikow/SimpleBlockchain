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
}