#!/usr/bin/env node
/**
 * NEXUS_NAIR Heatmap Generator
 * Fetches repository metadata from GitHub API and generates cross-repository relationship heatmap
 */

const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

// Language to emoji mapping
const LANGUAGE_EMOJI = {
  'JavaScript': '🟨',
  'TypeScript': '🔷',
  'Python': '🐍',
  'Java': '☕',
  'Go': '🐹',
  'Rust': '🦀',
  'PHP': '🐘',
  'Ruby': '💎',
  'C++': '⚙️',
  'C': '🔧',
  'C#': '🎯',
  'HTML': '🌐',
  'CSS': '🎨',
  'Shell': '🐚',
  'Swift': '🦅',
  'Kotlin': '🅺',
  'Dart': '🎯',
  'R': '📊',
  'Scala': '⚡',
  'Objective-C': '🍎',
};

const DEFAULT_EMOJI = '📦';

// Weight configuration for heatmap strength calculation
const WEIGHTS = {
  sharedContributors: 0.6,
  sharedTopics: 0.3,
  dependencyLink: 0.1,
};

class HeatmapGenerator {
  constructor(owner, token) {
    this.owner = owner || 'heyns1000';
    this.octokit = new Octokit({
      auth: token,
    });
    this.repos = [];
    this.repoMetadata = new Map();
  }

  /**
   * Fetch all repositories for the owner
   */
  async fetchRepositories() {
    console.log(`Fetching repositories for owner: ${this.owner}...`);
    
    try {
      const repos = [];
      let page = 1;
      const perPage = 100;
      
      while (true) {
        const response = await this.octokit.repos.listForUser({
          username: this.owner,
          per_page: perPage,
          page: page,
          sort: 'updated',
        });
        
        repos.push(...response.data);
        
        if (response.data.length < perPage) {
          break;
        }
        page++;
      }
      
      this.repos = repos;
      console.log(`Found ${repos.length} repositories`);
      return repos;
    } catch (error) {
      console.error('Error fetching repositories:', error.message);
      if (error.status === 403) {
        console.warn('Rate limit may be exceeded. Consider providing a GITHUB_TOKEN.');
      }
      throw error;
    }
  }

  /**
   * Fetch contributors for a repository
   */
  async fetchContributors(repo) {
    try {
      const contributors = [];
      let page = 1;
      const perPage = 100;
      
      while (true) {
        const response = await this.octokit.repos.listContributors({
          owner: this.owner,
          repo: repo.name,
          per_page: perPage,
          page: page,
        });
        
        contributors.push(...response.data.map(c => c.login));
        
        if (response.data.length < perPage) {
          break;
        }
        page++;
      }
      
      return new Set(contributors);
    } catch (error) {
      console.warn(`Could not fetch contributors for ${repo.name}:`, error.message);
      return new Set();
    }
  }

  /**
   * Fetch topics for a repository
   */
  async fetchTopics(repo) {
    try {
      const response = await this.octokit.repos.getAllTopics({
        owner: this.owner,
        repo: repo.name,
      });
      return new Set(response.data.names || []);
    } catch (error) {
      console.warn(`Could not fetch topics for ${repo.name}:`, error.message);
      return new Set();
    }
  }

  /**
   * Try to fetch package.json to detect dependencies
   */
  async fetchDependencies(repo) {
    try {
      const response = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: repo.name,
        path: 'package.json',
      });
      
      if (response.data.content) {
        const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
        const pkg = JSON.parse(content);
        const deps = new Set();
        
        // Collect all dependencies
        if (pkg.dependencies) {
          Object.keys(pkg.dependencies).forEach(dep => deps.add(dep));
        }
        if (pkg.devDependencies) {
          Object.keys(pkg.devDependencies).forEach(dep => deps.add(dep));
        }
        
        return deps;
      }
    } catch (error) {
      // package.json might not exist or be inaccessible
      return new Set();
    }
    return new Set();
  }

  /**
   * Fetch metadata for all repositories
   */
  async fetchAllMetadata() {
    console.log('Fetching metadata for all repositories...');
    
    for (const repo of this.repos) {
      console.log(`  Processing ${repo.name}...`);
      
      const [contributors, topics, dependencies] = await Promise.all([
        this.fetchContributors(repo),
        this.fetchTopics(repo),
        this.fetchDependencies(repo),
      ]);
      
      this.repoMetadata.set(repo.full_name, {
        repo,
        contributors,
        topics,
        dependencies,
        language: repo.language || 'Unknown',
      });
    }
    
    console.log('Metadata fetching complete');
  }

  /**
   * Calculate relationship strength between two repositories
   */
  calculateStrength(repo1Meta, repo2Meta) {
    // Shared contributors score
    const sharedContributors = this.setIntersection(
      repo1Meta.contributors,
      repo2Meta.contributors
    );
    const maxContributors = Math.max(
      repo1Meta.contributors.size,
      repo2Meta.contributors.size
    );
    const contributorScore = maxContributors > 0
      ? sharedContributors.size / maxContributors
      : 0;
    
    // Shared topics score
    const sharedTopics = this.setIntersection(
      repo1Meta.topics,
      repo2Meta.topics
    );
    const maxTopics = Math.max(
      repo1Meta.topics.size,
      repo2Meta.topics.size
    );
    const topicScore = maxTopics > 0
      ? sharedTopics.size / maxTopics
      : 0;
    
    // Dependency link score (does one depend on the other?)
    let dependencyScore = 0;
    const repo1Name = repo1Meta.repo.name;
    const repo2Name = repo2Meta.repo.name;
    
    if (repo1Meta.dependencies.has(repo2Name) || repo2Meta.dependencies.has(repo1Name)) {
      dependencyScore = 1;
    }
    
    // Weighted sum
    const rawScore = (
      contributorScore * WEIGHTS.sharedContributors +
      topicScore * WEIGHTS.sharedTopics +
      dependencyScore * WEIGHTS.dependencyLink
    );
    
    return rawScore;
  }

  /**
   * Set intersection helper
   */
  setIntersection(set1, set2) {
    const intersection = new Set();
    for (const item of set1) {
      if (set2.has(item)) {
        intersection.add(item);
      }
    }
    return intersection;
  }

  /**
   * Compute heatmap matrix with all relationships
   */
  computeHeatmap() {
    console.log('Computing heatmap matrix...');
    
    const matrix = {};
    const rawScores = [];
    const repoIds = Array.from(this.repoMetadata.keys());
    
    // Calculate all pairwise relationships
    for (let i = 0; i < repoIds.length; i++) {
      const sourceId = repoIds[i];
      const sourceMeta = this.repoMetadata.get(sourceId);
      matrix[sourceId] = {};
      
      for (let j = 0; j < repoIds.length; j++) {
        if (i === j) continue; // Skip self-relationships
        
        const targetId = repoIds[j];
        const targetMeta = this.repoMetadata.get(targetId);
        
        const rawScore = this.calculateStrength(sourceMeta, targetMeta);
        rawScores.push(rawScore);
        
        matrix[sourceId][targetId] = {
          rawScore,
          sourceId,
          targetId,
        };
      }
    }
    
    // Find max score for normalization
    const maxScore = Math.max(...rawScores, 0.001); // Avoid division by zero
    
    // Normalize scores to 0-100 and add additional fields
    for (const sourceId of repoIds) {
      for (const targetId of Object.keys(matrix[sourceId])) {
        const cell = matrix[sourceId][targetId];
        const normalizedStrength = Math.round((cell.rawScore / maxScore) * 100);
        
        cell.strength = normalizedStrength;
        cell.type = 'repo-correlation';
        cell.bidirectional = true;
        
        // Calculate additional metrics (simplified heuristics)
        cell.integrationPotential = Math.min(100, normalizedStrength + 20);
        cell.strategicValue = Math.round(normalizedStrength * 0.8);
        cell.operationalSynergy = Math.round(normalizedStrength * 0.9);
        
        // Remove rawScore from final output
        delete cell.rawScore;
      }
    }
    
    console.log('Heatmap matrix computed');
    return matrix;
  }

  /**
   * Compute sector data (one sector per repository)
   */
  computeSectors() {
    console.log('Computing sectors...');
    
    const sectors = [];
    
    for (const [repoId, meta] of this.repoMetadata.entries()) {
      const emoji = LANGUAGE_EMOJI[meta.language] || DEFAULT_EMOJI;
      
      sectors.push({
        id: repoId,
        name: meta.repo.name,
        emoji: emoji,
        influence: 0, // Will be computed later
        brandCount: 0,
        totalElements: 0,
      });
    }
    
    return sectors;
  }

  /**
   * Compute influence scores for each sector
   */
  computeInfluence(matrix, sectors) {
    console.log('Computing influence scores...');
    
    const influenceScores = {};
    
    for (const sector of sectors) {
      const sourceId = sector.id;
      const row = matrix[sourceId] || {};
      
      // Sum of all outgoing strengths
      const totalStrength = Object.values(row).reduce((sum, cell) => sum + cell.strength, 0);
      influenceScores[sourceId] = totalStrength;
    }
    
    // Find max influence for normalization
    const maxInfluence = Math.max(...Object.values(influenceScores), 1);
    
    // Normalize to 0-100 and update sectors
    for (const sector of sectors) {
      const rawInfluence = influenceScores[sector.id] || 0;
      sector.influence = Math.round((rawInfluence / maxInfluence) * 100);
    }
    
    console.log('Influence scores computed');
  }

  /**
   * Compute analytics
   */
  computeAnalytics(matrix, sectors) {
    console.log('Computing analytics...');
    
    let totalConnections = 0;
    let strongestConnection = 0;
    let totalStrength = 0;
    let connectionCount = 0;
    
    for (const sourceId in matrix) {
      for (const targetId in matrix[sourceId]) {
        const cell = matrix[sourceId][targetId];
        if (cell.strength > 0) {
          totalConnections++;
          totalStrength += cell.strength;
          connectionCount++;
          
          if (cell.strength > strongestConnection) {
            strongestConnection = cell.strength;
          }
        }
      }
    }
    
    const averageStrength = connectionCount > 0
      ? Math.round(totalStrength / connectionCount)
      : 0;
    
    // Find most influential sector
    let mostInfluentialSector = null;
    let maxInfluence = -1;
    
    for (const sector of sectors) {
      if (sector.influence > maxInfluence) {
        maxInfluence = sector.influence;
        mostInfluentialSector = sector.id;
      }
    }
    
    const analytics = {
      totalConnections,
      strongestConnection,
      averageStrength,
      mostInfluentialSector,
    };
    
    console.log('Analytics:', analytics);
    return analytics;
  }

  /**
   * Generate the complete heatmap data
   */
  async generate() {
    console.log('Starting heatmap generation...');
    console.log('='.repeat(50));
    
    // Fetch repositories
    await this.fetchRepositories();
    
    if (this.repos.length === 0) {
      console.warn('No repositories found. Exiting.');
      return null;
    }
    
    // Fetch metadata
    await this.fetchAllMetadata();
    
    // Compute heatmap
    const matrix = this.computeHeatmap();
    const sectors = this.computeSectors();
    this.computeInfluence(matrix, sectors);
    const analytics = this.computeAnalytics(matrix, sectors);
    
    const heatmapData = {
      matrix,
      sectors,
      analytics,
    };
    
    console.log('='.repeat(50));
    console.log('Heatmap generation complete!');
    
    return heatmapData;
  }

  /**
   * Save heatmap data to file
   */
  saveToFile(heatmapData, outputPath) {
    console.log(`Saving heatmap to ${outputPath}...`);
    
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(heatmapData, null, 2), 'utf-8');
    console.log('Heatmap saved successfully!');
  }
}

// Main execution
async function main() {
  const owner = process.env.OWNER || 'heyns1000';
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    console.warn('WARNING: GITHUB_TOKEN not provided. Proceeding unauthenticated.');
    console.warn('You may experience rate limiting. Consider setting GITHUB_TOKEN.');
  }
  
  const generator = new HeatmapGenerator(owner, token);
  
  try {
    const heatmapData = await generator.generate();
    
    if (heatmapData) {
      const outputPath = path.join(__dirname, '../../data', `heatmap-${owner}.json`);
      generator.saveToFile(heatmapData, outputPath);
      
      console.log('');
      console.log('✅ Success! Heatmap generated successfully.');
      console.log(`📊 Total repositories: ${generator.repos.length}`);
      console.log(`🔗 Total connections: ${heatmapData.analytics.totalConnections}`);
      console.log(`💪 Strongest connection: ${heatmapData.analytics.strongestConnection}`);
      console.log(`📈 Average strength: ${heatmapData.analytics.averageStrength}`);
      console.log(`🏆 Most influential: ${heatmapData.analytics.mostInfluentialSector}`);
      
      process.exit(0);
    } else {
      console.error('Failed to generate heatmap data');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error generating heatmap:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { HeatmapGenerator };
