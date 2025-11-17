/**
 * Gorilla Codex - Logic Layer
 * Core business logic engine for NEXUS_NAIR
 */

export class GorillaCodex {
  constructor(vaultChain) {
    this.vaultChain = vaultChain;
    this.rules = new Map();
    this.processors = new Map();
    this.initializeRules();
  }

  initializeRules() {
    // Target: 13,713 brands at 152.4% target
    this.rules.set('TARGET_BRANDS', 13713);
    this.rules.set('TARGET_PERCENTAGE', 152.4);
    this.rules.set('BASE_TARGET', Math.floor(13713 / 1.524)); // ~9000
  }

  processTransaction(transaction) {
    const { type, data } = transaction;
    
    switch (type) {
      case 'ADD_BRAND':
        return this.processBrandAddition(data);
      case 'UPDATE_BRAND':
        return this.processBrandUpdate(data);
      case 'QUERY_BRANDS':
        return this.queryBrands(data);
      default:
        throw new Error(`Unknown transaction type: ${type}`);
    }
  }

  processBrandAddition(brandData) {
    const brandId = this.vaultChain.addBrand(brandData);
    this.vaultChain.addBlock({
      type: 'BRAND_ADDED',
      brandId,
      brandData,
      totalBrands: this.vaultChain.getBrandCount()
    });
    return { success: true, brandId };
  }

  processBrandUpdate(data) {
    const { brandId, updates } = data;
    const brand = this.vaultChain.brands.get(brandId);
    
    if (!brand) {
      throw new Error(`Brand ${brandId} not found`);
    }

    Object.assign(brand, updates, { updatedAt: Date.now() });
    this.vaultChain.addBlock({
      type: 'BRAND_UPDATED',
      brandId,
      updates
    });
    
    return { success: true, brandId };
  }

  queryBrands(filter) {
    const brands = Array.from(this.vaultChain.brands.values());
    
    if (filter && filter.category) {
      return brands.filter(b => b.category === filter.category);
    }
    
    return brands;
  }

  getTargetProgress() {
    const currentBrands = this.vaultChain.getBrandCount();
    const targetBrands = this.rules.get('TARGET_BRANDS');
    const baseTarget = this.rules.get('BASE_TARGET');
    
    return {
      current: currentBrands,
      target: targetBrands,
      baseTarget,
      percentage: ((currentBrands / baseTarget) * 100).toFixed(1),
      targetPercentage: this.rules.get('TARGET_PERCENTAGE')
    };
  }

  validateChain() {
    return this.vaultChain.isValid();
  }
}

export default GorillaCodex;
