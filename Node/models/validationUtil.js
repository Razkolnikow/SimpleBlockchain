const CryptoJS = require('crypto-js');

module.exports = class ValidationUtil {
    constructor () {

    }

    validateMinedBlockHash(block, minedHash, nonce) {
        let hash = CryptoJS.SHA256(block.blockDataHash + nonce).toString();
        
        return minedHash === hash;
    }
}