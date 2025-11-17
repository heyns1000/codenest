/**
 * Vault Chain™ - Ledger Layer
 * Secure blockchain-based ledger system for NEXUS_NAIR
 */

export class VaultChain {
  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
    this.brands = new Map();
    this.initializeGenesis();
  }

  initializeGenesis() {
    const genesisBlock = {
      index: 0,
      timestamp: Date.now(),
      data: { type: 'GENESIS', brandCount: 0 },
      previousHash: '0',
      hash: this.calculateHash(0, Date.now(), { type: 'GENESIS' }, '0')
    };
    this.chain.push(genesisBlock);
  }

  calculateHash(index, timestamp, data, previousHash) {
    return `${index}${timestamp}${JSON.stringify(data)}${previousHash}`.split('').reduce(
      (hash, char) => ((hash << 5) - hash) + char.charCodeAt(0), 0
    ).toString(16);
  }

  addBrand(brandData) {
    const brandId = `BRAND_${this.brands.size + 1}`;
    this.brands.set(brandId, {
      ...brandData,
      id: brandId,
      timestamp: Date.now(),
      verified: true
    });
    return brandId;
  }

  addBlock(data) {
    const lastBlock = this.chain[this.chain.length - 1];
    const newBlock = {
      index: lastBlock.index + 1,
      timestamp: Date.now(),
      data,
      previousHash: lastBlock.hash,
      hash: ''
    };
    newBlock.hash = this.calculateHash(
      newBlock.index,
      newBlock.timestamp,
      newBlock.data,
      newBlock.previousHash
    );
    this.chain.push(newBlock);
    return newBlock;
  }

  getBrandCount() {
    return this.brands.size;
  }

  getChainLength() {
    return this.chain.length;
  }

  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

export default VaultChain;
