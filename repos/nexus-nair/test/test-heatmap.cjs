/**
 * Test file for heatmap generator
 * Tests the core logic without making real API calls
 */

const { HeatmapGenerator } = require('../scripts/heatmap/generate_heatmap.cjs');

// Mock test data
const mockRepos = [
  {
    id: 1,
    name: 'repo1',
    full_name: 'heyns1000/repo1',
    language: 'JavaScript',
  },
  {
    id: 2,
    name: 'repo2',
    full_name: 'heyns1000/repo2',
    language: 'Python',
  },
  {
    id: 3,
    name: 'repo3',
    full_name: 'heyns1000/repo3',
    language: 'JavaScript',
  },
];

function testSetIntersection() {
  const generator = new HeatmapGenerator('heyns1000', null);
  
  const set1 = new Set(['a', 'b', 'c']);
  const set2 = new Set(['b', 'c', 'd']);
  
  const result = generator.setIntersection(set1, set2);
  
  console.assert(result.size === 2, 'Set intersection should have 2 elements');
  console.assert(result.has('b'), 'Intersection should contain "b"');
  console.assert(result.has('c'), 'Intersection should contain "c"');
  
  console.log('✓ Set intersection test passed');
}

function testCalculateStrength() {
  const generator = new HeatmapGenerator('heyns1000', null);
  
  const repo1Meta = {
    repo: mockRepos[0],
    contributors: new Set(['alice', 'bob', 'charlie']),
    topics: new Set(['javascript', 'react', 'node']),
    dependencies: new Set(['express', 'lodash']),
    language: 'JavaScript',
  };
  
  const repo2Meta = {
    repo: mockRepos[1],
    contributors: new Set(['bob', 'charlie', 'david']),
    topics: new Set(['python', 'django', 'react']),
    dependencies: new Set(['flask', 'requests']),
    language: 'Python',
  };
  
  const strength = generator.calculateStrength(repo1Meta, repo2Meta);
  
  // Shared contributors: 2/3 = 0.667 * 0.6 = 0.4
  // Shared topics: 1/3 = 0.333 * 0.3 = 0.1
  // Dependencies: 0 * 0.1 = 0
  // Total: ~0.5
  
  console.assert(strength > 0.4 && strength < 0.6, `Strength should be ~0.5, got ${strength}`);
  console.log('✓ Calculate strength test passed');
}

function testCalculateStrengthWithDependency() {
  const generator = new HeatmapGenerator('heyns1000', null);
  
  const repo1Meta = {
    repo: { name: 'repo1', full_name: 'heyns1000/repo1' },
    contributors: new Set(['alice']),
    topics: new Set(['javascript']),
    dependencies: new Set(['repo2']), // repo1 depends on repo2
    language: 'JavaScript',
  };
  
  const repo2Meta = {
    repo: { name: 'repo2', full_name: 'heyns1000/repo2' },
    contributors: new Set(['bob']),
    topics: new Set(['python']),
    dependencies: new Set([]),
    language: 'Python',
  };
  
  const strength = generator.calculateStrength(repo1Meta, repo2Meta);
  
  // Should have dependency contribution
  console.assert(strength > 0, 'Strength should be > 0 due to dependency');
  console.log('✓ Calculate strength with dependency test passed');
}

function testComputeSectors() {
  const generator = new HeatmapGenerator('heyns1000', null);
  
  generator.repos = mockRepos;
  generator.repoMetadata = new Map([
    ['heyns1000/repo1', {
      repo: mockRepos[0],
      contributors: new Set(['alice']),
      topics: new Set(['javascript']),
      dependencies: new Set([]),
      language: 'JavaScript',
    }],
    ['heyns1000/repo2', {
      repo: mockRepos[1],
      contributors: new Set(['bob']),
      topics: new Set(['python']),
      dependencies: new Set([]),
      language: 'Python',
    }],
  ]);
  
  const sectors = generator.computeSectors();
  
  console.assert(sectors.length === 2, `Should have 2 sectors, got ${sectors.length}`);
  console.assert(sectors[0].id === 'heyns1000/repo1', 'First sector should be repo1');
  console.assert(sectors[0].emoji === '🟨', 'JavaScript should have 🟨 emoji');
  console.assert(sectors[1].emoji === '🐍', 'Python should have 🐍 emoji');
  
  console.log('✓ Compute sectors test passed');
}

function testNormalization() {
  const generator = new HeatmapGenerator('heyns1000', null);
  
  generator.repos = mockRepos.slice(0, 2);
  generator.repoMetadata = new Map([
    ['heyns1000/repo1', {
      repo: mockRepos[0],
      contributors: new Set(['alice', 'bob']),
      topics: new Set(['javascript', 'node']),
      dependencies: new Set([]),
      language: 'JavaScript',
    }],
    ['heyns1000/repo2', {
      repo: mockRepos[1],
      contributors: new Set(['bob', 'charlie']),
      topics: new Set(['python', 'django']),
      dependencies: new Set([]),
      language: 'Python',
    }],
  ]);
  
  const matrix = generator.computeHeatmap();
  
  // Check that strengths are normalized to 0-100
  const cell = matrix['heyns1000/repo1']['heyns1000/repo2'];
  console.assert(cell.strength >= 0 && cell.strength <= 100, 
    `Strength should be 0-100, got ${cell.strength}`);
  console.assert(cell.type === 'repo-correlation', 'Type should be repo-correlation');
  console.assert(cell.bidirectional === true, 'Should be bidirectional');
  console.assert(typeof cell.integrationPotential === 'number', 'Should have integrationPotential');
  console.assert(typeof cell.strategicValue === 'number', 'Should have strategicValue');
  console.assert(typeof cell.operationalSynergy === 'number', 'Should have operationalSynergy');
  
  console.log('✓ Normalization test passed');
}

function testAnalytics() {
  const generator = new HeatmapGenerator('heyns1000', null);
  
  const matrix = {
    'heyns1000/repo1': {
      'heyns1000/repo2': { strength: 50 },
      'heyns1000/repo3': { strength: 75 },
    },
    'heyns1000/repo2': {
      'heyns1000/repo1': { strength: 50 },
      'heyns1000/repo3': { strength: 25 },
    },
    'heyns1000/repo3': {
      'heyns1000/repo1': { strength: 75 },
      'heyns1000/repo2': { strength: 25 },
    },
  };
  
  const sectors = [
    { id: 'heyns1000/repo1', influence: 0 },
    { id: 'heyns1000/repo2', influence: 0 },
    { id: 'heyns1000/repo3', influence: 0 },
  ];
  
  const analytics = generator.computeAnalytics(matrix, sectors);
  
  console.assert(analytics.totalConnections === 6, 
    `Total connections should be 6, got ${analytics.totalConnections}`);
  console.assert(analytics.strongestConnection === 75, 
    `Strongest connection should be 75, got ${analytics.strongestConnection}`);
  console.assert(analytics.averageStrength === 50, 
    `Average strength should be 50, got ${analytics.averageStrength}`);
  console.assert(analytics.mostInfluentialSector, 'Should have mostInfluentialSector');
  
  console.log('✓ Analytics test passed');
}

// Run all tests
console.log('Running heatmap generator tests...\n');

try {
  testSetIntersection();
  testCalculateStrength();
  testCalculateStrengthWithDependency();
  testComputeSectors();
  testNormalization();
  testAnalytics();
  
  console.log('\n✅ All tests passed!');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Test failed:', error);
  process.exit(1);
}
