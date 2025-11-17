import VaultChain from './ledger/VaultChain.js';
import GorillaCodex from './logic/GorillaCodex.js';
import PulseTrade from './logic/PulseTrade.js';
import FAACloud from './infra/FAACloud.js';
import R2Storage from './infra/R2Storage.js';
import ClaimRoot from './governance/ClaimRoot.js';

/**
 * NEXUS_NAIR System
 * Integrates all 5 layers of the FCU Stack
 */

export class NexusSystem {
  constructor() {
    // Layer 1: Ledger - Vault Chain™
    this.ledger = new VaultChain();
    
    // Layer 2: Logic - Gorilla Codex + 9s PulseTrade™
    this.logic = new GorillaCodex(this.ledger);
    this.pulseTrade = new PulseTrade(this.logic);
    
    // Layer 3: Infrastructure - FAA Cloud™ + R2
    this.cloud = new FAACloud();
    this.storage = new R2Storage();
    
    // Layer 4: Interface - React/Tailwind + Banimal Checkout
    // (Handled by React components)
    
    // Layer 5: Governance - ClaimRoot™
    this.governance = new ClaimRoot();
    
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) {
      return;
    }

    console.log('🚀 Initializing NEXUS_NAIR System...');
    
    // Setup infrastructure
    this.cloud.provisionInstance({
      name: 'nexus-primary',
      type: 't3.xlarge',
      region: 'us-east-1'
    });
    
    this.storage.createBucket('nexus-brands', {
      versioning: true,
      region: 'auto'
    });
    
    // Register governance validators
    this.governance.registerValidator('VALIDATOR_1', 100);
    this.governance.registerValidator('VALIDATOR_2', 100);
    this.governance.registerValidator('VALIDATOR_3', 100);
    
    console.log('✅ Infrastructure initialized');
    console.log('✅ Governance validators registered');
    
    this.initialized = true;
  }

  async loadBrandsData(brandsData) {
    console.log(`📦 Loading ${brandsData.length} brands...`);
    
    let loaded = 0;
    for (const brand of brandsData) {
      try {
        this.logic.processTransaction({
          type: 'ADD_BRAND',
          data: brand
        });
        
        // Store in R2
        this.storage.putObject('nexus-brands', brand.id, brand);
        
        loaded++;
        
        if (loaded % 1000 === 0) {
          console.log(`  Loaded ${loaded} brands...`);
        }
      } catch (error) {
        console.error(`Error loading brand ${brand.id}:`, error.message);
      }
    }
    
    console.log(`✅ Successfully loaded ${loaded} brands`);
    return loaded;
  }

  getSystemStatus() {
    const progress = this.logic.getTargetProgress();
    const cloudStatus = this.cloud.getCloudStatus();
    const storageStats = this.storage.getStorageStats();
    const govStats = this.governance.getGovernanceStats();
    
    return {
      initialized: this.initialized,
      layers: {
        ledger: {
          name: 'Vault Chain™',
          status: 'OPERATIONAL',
          chainLength: this.ledger.getChainLength(),
          brands: this.ledger.getBrandCount(),
          valid: this.ledger.isValid()
        },
        logic: {
          name: 'Gorilla Codex + 9s PulseTrade™',
          status: 'OPERATIONAL',
          progress: progress,
          activePulses: this.pulseTrade.getActivePulses().length
        },
        infrastructure: {
          name: 'FAA Cloud™ + R2',
          status: 'OPERATIONAL',
          cloud: cloudStatus,
          storage: storageStats
        },
        interface: {
          name: 'React/Tailwind + Banimal Checkout',
          status: 'OPERATIONAL',
          type: 'Web Application'
        },
        governance: {
          name: 'ClaimRoot™',
          status: 'OPERATIONAL',
          stats: govStats
        }
      },
      targetProgress: {
        current: progress.current,
        target: progress.target,
        percentage: progress.percentage,
        targetPercentage: progress.targetPercentage
      }
    };
  }

  generateReport() {
    const status = this.getSystemStatus();
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('           NEXUS_NAIR SYSTEM REPORT');
    console.log('           5-Layer FCU Stack™');
    console.log('═══════════════════════════════════════════════════════\n');
    
    console.log('📊 TARGET PROGRESS:');
    console.log(`   Current Brands: ${status.targetProgress.current.toLocaleString()}`);
    console.log(`   Target Brands: ${status.targetProgress.target.toLocaleString()}`);
    console.log(`   Progress: ${status.targetProgress.percentage}%`);
    console.log(`   Target %: ${status.targetProgress.targetPercentage}%`);
    console.log('');
    
    console.log('🔐 LAYER 1 - VAULT CHAIN™ (Ledger):');
    console.log(`   Status: ${status.layers.ledger.status}`);
    console.log(`   Chain Length: ${status.layers.ledger.chainLength}`);
    console.log(`   Brands Secured: ${status.layers.ledger.brands}`);
    console.log(`   Valid: ${status.layers.ledger.valid ? 'YES' : 'NO'}`);
    console.log('');
    
    console.log('🦍 LAYER 2 - GORILLA CODEX + 9S PULSETRADE™ (Logic):');
    console.log(`   Status: ${status.layers.logic.status}`);
    console.log(`   Active Pulses: ${status.layers.logic.activePulses}`);
    console.log('');
    
    console.log('☁️  LAYER 3 - FAA CLOUD™ + R2 (Infrastructure):');
    console.log(`   Status: ${status.layers.infrastructure.status}`);
    console.log(`   Cloud Instances: ${status.layers.infrastructure.cloud.instances}`);
    console.log(`   Storage Objects: ${status.layers.infrastructure.storage.totalObjects}`);
    console.log('');
    
    console.log('🎨 LAYER 4 - REACT/TAILWIND + BANIMAL CHECKOUT (Interface):');
    console.log(`   Status: ${status.layers.interface.status}`);
    console.log(`   Type: ${status.layers.interface.type}`);
    console.log('');
    
    console.log('⚖️  LAYER 5 - CLAIMROOT™ (Governance):');
    console.log(`   Status: ${status.layers.governance.status}`);
    console.log(`   Validators: ${status.layers.governance.stats.validators}`);
    console.log(`   Claims: ${status.layers.governance.stats.claims}`);
    console.log(`   Proposals: ${status.layers.governance.stats.proposals}`);
    console.log('');
    
    console.log('═══════════════════════════════════════════════════════\n');
    
    return status;
  }
}

export default NexusSystem;
