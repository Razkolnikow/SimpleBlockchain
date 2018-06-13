module.exports = class Transaction {
    constructor () {
        // TODO
        this.from = ''; // Address (40 hex digits)
        this.to = ''; // Address (40 hex digits)
        this.value = ''; // non negative integer
        this.fee = ''; //   non negative integer
        this.dateCreated = ''; // String ISO8601_string
        this.data = ''; // String optional
        this.senderPubKey = ''; // hex number 65
        this.transactionDataHash = ''; // Hex_number
        this.senderSignature = ''; // hex number [2][64]
        this.minedInBlockIndex = ''; // integer
        this.transferSuccessful = ''; // bool
    }
}