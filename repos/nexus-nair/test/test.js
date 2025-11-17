/**
 * NEXUS_NAIR System Tests
 * Tests all 5 layers of the FCU Stack
 */

import VaultChain from '../src/ledger/VaultChain.js';
import GorillaCodex from '../src/logic/GorillaCodex.js';
import PulseTrade from '../src/logic/PulseTrade.js';
import FAACloud from '../src/infra/FAACloud.js';
import R2Storage from '../src/infra/R2Storage.js';
import ClaimRoot from '../src/governance/ClaimRoot.js';
import NexusSystem from '../src/NexusSystem.js';
import { generateBrandsData } from '../src/generateBrands.js';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    testsPassed++;
  } else {
    console.error(`  ✗ ${message}`);
    testsFailed++;
  }
}

console.log('\n═══════════════════════════════════════════════════════');
console.log('           NEXUS_NAIR SYSTEM TESTS');
console.log('═══════════════════════════════════════════════════════\n');

// Test Layer 1: Vault Chain™
console.log('🔐 Testing Layer 1: Vault Chain™');
const vaultChain = new VaultChain();
assert(vaultChain.getChainLength() === 1, 'Genesis block created');
assert(vaultChain.isValid(), 'Chain is valid initially');

const brandId1 = vaultChain.addBrand({ name: 'Test Brand 1', category: 'Tech' });
assert(brandId1 === 'BRAND_1', 'First brand ID is correct');
assert(vaultChain.getBrandCount() === 1, 'Brand count is 1');

vaultChain.addBlock({ type: 'TEST', data: 'test' });
assert(vaultChain.getChainLength() === 2, 'Block added to chain');
assert(vaultChain.isValid(), 'Chain remains valid after addition');
console.log('');

// Test Layer 2: Gorilla Codex
console.log('🦍 Testing Layer 2: Gorilla Codex');
const gorilla = new GorillaCodex(vaultChain);
const result = gorilla.processTransaction({
  type: 'ADD_BRAND',
  data: { name: 'Test Brand 2', category: 'Fashion' }
});
assert(result.success, 'Brand transaction processed successfully');
assert(vaultChain.getBrandCount() === 2, 'Brand count increased to 2');

const progress = gorilla.getTargetProgress();
assert(progress.target === 13713, 'Target is 13,713 brands');
assert(progress.targetPercentage === 152.4, 'Target percentage is 152.4%');
assert(gorilla.validateChain(), 'Chain validation through Gorilla Codex works');
console.log('');

// Test Layer 2: PulseTrade™
console.log('⚡ Testing Layer 2: 9s PulseTrade™');
const pulseTrade = new PulseTrade(gorilla);
const trade = pulseTrade.executeTrade({
  type: 'BRAND_TRANSACTION',
  brandData: { name: 'Test Brand 3', category: 'Finance' }
});
assert(trade.status === 'EXECUTED', 'Trade executed successfully');
assert(trade.id.startsWith('TRADE_'), 'Trade has correct ID format');

const tradeHistory = pulseTrade.getTradeHistory();
assert(tradeHistory.length === 1, 'Trade history recorded');
assert(pulseTrade.getActivePulses().length === 0, 'No active pulses initially');
console.log('');

// Test Layer 3: FAA Cloud™
console.log('☁️  Testing Layer 3: FAA Cloud™');
const cloud = new FAACloud();
const instance = cloud.provisionInstance({
  name: 'test-instance',
  type: 't3.medium',
  region: 'us-east-1'
});
assert(instance.status === 'RUNNING', 'Instance provisioned with RUNNING status');
assert(instance.id.startsWith('FAA_'), 'Instance has correct ID format');

const lbId = cloud.createLoadBalancer('test-lb', [instance.id]);
assert(lbId.startsWith('LB_'), 'Load balancer created');

cloud.recordMetric('request', 10);
const metrics = cloud.getMetrics();
assert(metrics.requests === 10, 'Metrics recorded correctly');

const status = cloud.getCloudStatus();
assert(status.instances === 1, 'Cloud reports correct instance count');
assert(status.status === 'OPERATIONAL', 'Cloud is operational');
console.log('');

// Test Layer 3: R2 Storage
console.log('💾 Testing Layer 3: R2 Storage');
const r2 = new R2Storage();
const bucket = r2.createBucket('test-bucket', { versioning: true });
assert(bucket.name === 'test-bucket', 'Bucket created with correct name');
assert(bucket.versioning === true, 'Bucket versioning enabled');

const obj = r2.putObject('test-bucket', 'test-key', { data: 'test' });
assert(obj.key === 'test-key', 'Object stored with correct key');
assert(obj.etag, 'Object has ETag');

const retrieved = r2.getObject('test-bucket', 'test-key');
assert(retrieved.data.data === 'test', 'Object retrieved correctly');

const stats = r2.getStorageStats();
assert(stats.totalObjects === 1, 'Storage stats show 1 object');
assert(stats.buckets === 1, 'Storage stats show 1 bucket');
console.log('');

// Test Layer 5: ClaimRoot™
console.log('⚖️  Testing Layer 5: ClaimRoot™');
const governance = new ClaimRoot();
governance.registerValidator('VAL1', 100);
governance.registerValidator('VAL2', 50);
assert(governance.validators.size === 2, 'Validators registered');

const claim = governance.submitClaim({
  type: 'BRAND_VERIFICATION',
  brandId: 'BRAND_1'
});
assert(claim.status === 'PENDING', 'Claim submitted with PENDING status');

governance.validateClaim(claim.id, 'VAL1', 'APPROVE', 'Looks good');
governance.validateClaim(claim.id, 'VAL2', 'APPROVE', 'Verified');
governance.validateClaim(claim.id, 'VAL1', 'APPROVE', 'Second check');

const resolvedClaim = governance.claims.get(claim.id);
assert(resolvedClaim.status === 'APPROVED', 'Claim auto-resolved to APPROVED');

const proposal = governance.createProposal({
  title: 'Test Proposal',
  description: 'Testing governance'
});
assert(proposal.status === 'ACTIVE', 'Proposal created as ACTIVE');

governance.vote(proposal.id, 'VAL1', 'FOR');
const results = governance.getProposalResults(proposal.id);
assert(results.forVotes === 100, 'Votes recorded correctly with voting power');
console.log('');

// Test Integrated System
console.log('🚀 Testing Integrated NEXUS_NAIR System');
const system = new NexusSystem();
await system.initialize();
assert(system.initialized, 'System initialized successfully');

const systemStatus = system.getSystemStatus();
assert(systemStatus.layers.ledger.status === 'OPERATIONAL', 'Ledger layer operational');
assert(systemStatus.layers.logic.status === 'OPERATIONAL', 'Logic layer operational');
assert(systemStatus.layers.infrastructure.status === 'OPERATIONAL', 'Infrastructure layer operational');
assert(systemStatus.layers.interface.status === 'OPERATIONAL', 'Interface layer operational');
assert(systemStatus.layers.governance.status === 'OPERATIONAL', 'Governance layer operational');
console.log('');

// Test Brand Generation
console.log('📦 Testing Brand Data Generation');
const testBrands = generateBrandsData(100);
assert(testBrands.length === 100, '100 brands generated');
assert(testBrands[0].id === 'BRAND_00001', 'First brand has correct ID');
assert(testBrands[99].id === 'BRAND_00100', 'Last brand has correct ID');
assert(testBrands[0].verified === true, 'Brands are verified');
assert(testBrands[0].tags.includes('nexus-verified'), 'Brands have nexus-verified tag');

// Test loading brands into system
const loaded = await system.loadBrandsData(testBrands.slice(0, 10));
assert(loaded === 10, '10 brands loaded into system');
console.log('');

// Test full target achievement
console.log('🎯 Testing Full Target (13,713 brands)');
const fullBrands = generateBrandsData(13713);
assert(fullBrands.length === 13713, 'Generated 13,713 brands');

const categories = new Set(fullBrands.map(b => b.category));
assert(categories.size >= 15, 'Brands span multiple categories');

const allVerified = fullBrands.every(b => b.verified === true);
assert(allVerified, 'All brands are verified');

const allHaveTags = fullBrands.every(b => b.tags && b.tags.length > 0);
assert(allHaveTags, 'All brands have tags');
console.log('');

// Final Report
console.log('═══════════════════════════════════════════════════════');
console.log('                   TEST RESULTS');
console.log('═══════════════════════════════════════════════════════');
console.log(`✓ Tests Passed: ${testsPassed}`);
console.log(`✗ Tests Failed: ${testsFailed}`);
console.log(`Total Tests: ${testsPassed + testsFailed}`);
console.log(`Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
console.log('═══════════════════════════════════════════════════════\n');

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('🎉 All tests passed! NEXUS_NAIR system is fully operational.\n');
  process.exit(0);
}
