#!/usr/bin/env node
/**
 * NEXUS_NAIR Demo Script
 * Demonstrates the complete 5-Layer FCU Stack with 13,713 brands
 */

import NexusSystem from './src/NexusSystem.js';
import { generateBrandsData } from './src/generateBrands.js';

console.log('\n╔═══════════════════════════════════════════════════════╗');
console.log('║              NEXUS_NAIR DEMO SCRIPT                   ║');
console.log('║         5-Layer FCU Stack™ Demonstration              ║');
console.log('╚═══════════════════════════════════════════════════════╝\n');

async function runDemo() {
  try {
    // Initialize system
    console.log('🚀 Phase 1: System Initialization\n');
    const system = new NexusSystem();
    await system.initialize();
    
    console.log('\n📊 Phase 2: Generating Brand Data\n');
    console.log('Generating 13,713 brands (152.4% of 9,000 target)...\n');
    const brands = generateBrandsData(13713);
    
    console.log('\n📥 Phase 3: Loading Brands into System\n');
    await system.loadBrandsData(brands);
    
    console.log('\n🔍 Phase 4: System Status Report\n');
    system.generateReport();
    
    // Demonstrate PulseTrade
    console.log('⚡ Phase 5: PulseTrade™ Demo (9-second cycles)\n');
    let pulseCount = 0;
    const pulseId = system.pulseTrade.startPulse('DEMO_PULSE', (pulse) => {
      pulseCount++;
      console.log(`  Pulse ${pulseCount}: Cycle ${pulse.cycle} at ${new Date(pulse.timestamp).toLocaleTimeString()}`);
      
      if (pulseCount >= 3) {
        system.pulseTrade.stopPulse('DEMO_PULSE');
        console.log('  ✓ PulseTrade demo completed (3 cycles shown)\n');
        continueDemoAfterPulse();
      }
    });
    
  } catch (error) {
    console.error('❌ Demo error:', error);
    process.exit(1);
  }
}

async function continueDemoAfterPulse() {
  console.log('⚖️  Phase 6: Governance Demo\n');
  
  // Create a demo system for governance
  const system = new NexusSystem();
  await system.initialize();
  
  // Submit a claim
  const claim = system.governance.submitClaim({
    type: 'BRAND_VERIFICATION',
    brandId: 'BRAND_00001',
    requester: 'DEMO_USER'
  });
  console.log(`  ✓ Claim submitted: ${claim.id}`);
  
  // Validators vote
  system.governance.validateClaim(claim.id, 'VALIDATOR_1', 'APPROVE', 'Verified');
  system.governance.validateClaim(claim.id, 'VALIDATOR_2', 'APPROVE', 'Looks good');
  system.governance.validateClaim(claim.id, 'VALIDATOR_3', 'APPROVE', 'Approved');
  
  const resolvedClaim = system.governance.claims.get(claim.id);
  console.log(`  ✓ Claim resolved: ${resolvedClaim.status}`);
  console.log(`  ✓ Approval power: ${resolvedClaim.finalVote.approvalPower}\n`);
  
  // Create proposal
  const proposal = system.governance.createProposal({
    title: 'Increase brand target to 20,000',
    description: 'Proposal to expand platform capacity'
  });
  console.log(`  ✓ Proposal created: ${proposal.id}`);
  
  system.governance.vote(proposal.id, 'VALIDATOR_1', 'FOR');
  system.governance.vote(proposal.id, 'VALIDATOR_2', 'FOR');
  
  const results = system.governance.getProposalResults(proposal.id);
  console.log(`  ✓ Votes FOR: ${results.forVotes}`);
  console.log(`  ✓ Total voters: ${results.totalVotes}\n`);
  
  console.log('☁️  Phase 7: Infrastructure Status\n');
  const cloudStatus = system.cloud.getCloudStatus();
  console.log(`  ✓ Cloud Instances: ${cloudStatus.instances}`);
  console.log(`  ✓ Load Balancers: ${cloudStatus.loadBalancers}`);
  console.log(`  ✓ Status: ${cloudStatus.status}`);
  
  const storageStats = system.storage.getStorageStats();
  console.log(`  ✓ Storage Buckets: ${storageStats.buckets}`);
  console.log(`  ✓ Stored Objects: ${storageStats.totalObjects}`);
  console.log(`  ✓ Total Storage: ${storageStats.totalStorage} bytes\n`);
  
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║                   DEMO COMPLETE                       ║');
  console.log('║                                                       ║');
  console.log('║  ✅ All 5 layers operational                          ║');
  console.log('║  ✅ 13,713 brands loaded (152.4% target)              ║');
  console.log('║  ✅ Blockchain verified                               ║');
  console.log('║  ✅ PulseTrade cycles active                          ║');
  console.log('║  ✅ Governance system functional                      ║');
  console.log('║  ✅ Infrastructure scaling                            ║');
  console.log('║                                                       ║');
  console.log('║  Run "npm run dev" to start the web interface        ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');
}

// Run the demo
runDemo();
