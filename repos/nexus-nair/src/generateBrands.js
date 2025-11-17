/**
 * Brands Data Generator
 * Generates 13,713 brands for NEXUS_NAIR (152.4% target)
 */

const CATEGORIES = [
  'Technology', 'Fashion', 'Food & Beverage', 'Finance', 'Healthcare',
  'Automotive', 'Entertainment', 'Real Estate', 'Education', 'Sports',
  'Beauty & Cosmetics', 'Travel', 'Retail', 'Energy', 'Telecommunications',
  'Agriculture', 'Manufacturing', 'Construction', 'Media', 'Logistics'
];

const BRAND_PREFIXES = [
  'Neo', 'Apex', 'Quantum', 'Zenith', 'Stellar', 'Prime', 'Elite', 'Ultra',
  'Mega', 'Super', 'Hyper', 'Omega', 'Alpha', 'Beta', 'Gamma', 'Delta',
  'Eco', 'Bio', 'Tech', 'Smart', 'Digital', 'Cyber', 'Next', 'Future',
  'Global', 'United', 'Advanced', 'Premium', 'Royal', 'Imperial'
];

const BRAND_SUFFIXES = [
  'Corp', 'Inc', 'Group', 'Enterprises', 'Industries', 'Solutions', 'Systems',
  'Technologies', 'Labs', 'Ventures', 'Capital', 'Holdings', 'Partners',
  'Services', 'International', 'Global', 'Brands', 'Co', 'Ltd', 'LLC'
];

const ADJECTIVES = [
  'Innovative', 'Dynamic', 'Leading', 'Premier', 'Superior', 'Excellent',
  'Professional', 'Modern', 'Advanced', 'Reliable', 'Trusted', 'Quality'
];

function generateBrandName(index) {
  const prefix = BRAND_PREFIXES[index % BRAND_PREFIXES.length];
  const suffix = BRAND_SUFFIXES[Math.floor(index / BRAND_PREFIXES.length) % BRAND_SUFFIXES.length];
  const num = Math.floor(index / (BRAND_PREFIXES.length * BRAND_SUFFIXES.length));
  
  if (num > 0) {
    return `${prefix} ${suffix} ${num}`;
  }
  return `${prefix} ${suffix}`;
}

function generateBrand(index) {
  const category = CATEGORIES[index % CATEGORIES.length];
  const name = generateBrandName(index);
  const adjective = ADJECTIVES[index % ADJECTIVES.length];
  
  // Use deterministic generation based on index for reproducibility
  // This is sample data generation, not cryptographic use
  const valueHash = (index * 7919) % 10000000;
  const employeeHash = (index * 3571) % 5000;
  const ratingHash = (index * 2111) % 150;
  const timeHash = (index * 8191) % (365 * 24 * 60 * 60 * 1000);
  
  return {
    id: `BRAND_${String(index + 1).padStart(5, '0')}`,
    name: name,
    category: category,
    description: `${adjective} ${category.toLowerCase()} company providing innovative solutions`,
    status: 'ACTIVE',
    value: valueHash + 100000,
    founded: 2000 + (index % 24),
    employees: employeeHash + 10,
    region: ['North America', 'Europe', 'Asia', 'South America', 'Africa'][index % 5],
    verified: true,
    rating: (3.5 + (ratingHash / 100)).toFixed(1),
    createdAt: Date.now() - timeHash,
    tags: [
      category.toLowerCase().replace(/\s+/g, '-'),
      adjective.toLowerCase(),
      'nexus-verified'
    ]
  };
}

export function generateBrandsData(count = 13713) {
  console.log(`Generating ${count} brands data...`);
  const brands = [];
  
  for (let i = 0; i < count; i++) {
    brands.push(generateBrand(i));
    
    if ((i + 1) % 1000 === 0) {
      console.log(`  Generated ${i + 1} brands...`);
    }
  }
  
  console.log(`✅ Generated ${count} brands`);
  return brands;
}

export function saveBrandsToFile(brands, filename = 'brands-data.json') {
  const fs = require('fs');
  fs.writeFileSync(filename, JSON.stringify(brands, null, 2));
  console.log(`✅ Saved brands to ${filename}`);
}

export default { generateBrandsData, saveBrandsToFile };
