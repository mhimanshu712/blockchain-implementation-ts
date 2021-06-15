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
}