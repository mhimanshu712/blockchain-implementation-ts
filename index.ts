import * as crypto from 'crypto'

class Transaction {
    constructor(
        public amount: number,
        public payer: string, //pk
        public payee: string   //pk
    ){}
    
    toString() {
        return JSON.stringify(this)
    }

}

class Block {
    constructor(
       public prevHash: string,
       public transaction: Transaction,
       public ts = Date.now()
    ){}

    get hash() {
        const str = JSON.stringify(this);
        const hash = crypto.createHash('SHA256');
        hash.update(str).end();
        return hash.digest('hex');
    }
}

class Chain {
    public static instance = new Chain();

    chain: Block[];

    constructor() {
        this.chain = [new Block(null, new Transaction(100, 'genesis','him'))];
    }

    get lastBlock() {
        return this.chain[this.chain.length -1];
    }

    addBlock(transaction: Transaction, senderPublicKey: string, signature: Buffer){
        const verifier = crypto.createVerify('SHA256');
        verifier.update(transaction.toString());

        const isValid = verifier.verify(senderPublicKey, signature);

        if(isValid){
            const newBlock = new Block(this.lastBlock.hash, transaction);
            this.chain.push(newBlock);
        }
    }
}

class Wallet {
    public publickey: string;
    public privatekey: string;

    constructor() {
        const keypair = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {type: 'spki', format: 'pem'},
            privateKeyEncoding: { type: 'pkcs8', format: 'pem'},
        });

        this.privatekey = keypair.privateKey;
        this.publickey = keypair.publicKey;
    }

    sendMoney(amount: number, payeePublicKey: string){
        const transaction = new Transaction(amount, this.publickey, payeePublicKey);

        const sign = crypto.createSign('SHA256');
        sign.update(transaction.toString()).end();

        const signature = sign.sign(this.privatekey);
        Chain.instance.addBlock(transaction, this.publickey, signature);
    }

}