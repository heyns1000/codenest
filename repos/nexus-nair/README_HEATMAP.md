# Repository Heatmap Generator

This tool automatically generates a cross-repository relationship heatmap for the `heyns1000` GitHub organization. It analyzes repositories to discover connections based on shared contributors, topics, and dependencies.

## Overview

The heatmap generator fetches metadata from GitHub and computes relationship strengths between repositories using a weighted heuristic:

- **Shared Contributors**: 60% weight
- **Shared Topics**: 30% weight  
- **Dependency Links**: 10% weight

The output is a JSON file containing a matrix of repository relationships, sector data (one per repository), and analytics.

## Output Format

The generated heatmap follows the `HeatmapData` schema expected by the CrossSectorHeatmap component:

```json
{
  "matrix": {
    "owner/repo1": {
      "owner/repo2": {
        "sourceId": "owner/repo1",
        "targetId": "owner/repo2",
        "strength": 75,
        "type": "repo-correlation",
        "bidirectional": true,
        "integrationPotential": 95,
        "strategicValue": 60,
        "operationalSynergy": 68
      }
    }
  },
  "sectors": [
    {
      "id": "owner/repo1",
      "name": "repo1",
      "emoji": "🟨",
      "influence": 100,
      "brandCount": 0,
      "totalElements": 0
    }
  ],
  "analytics": {
    "totalConnections": 42,
    "strongestConnection": 95,
    "averageStrength": 38,
    "mostInfluentialSector": "owner/repo1"
  }
}
```

## Running Locally

### Prerequisites

- Node.js 18 or higher
- npm

### Environment Variables

- `GITHUB_TOKEN` (optional but recommended): A GitHub personal access token to avoid rate limiting
- `OWNER` (optional): The GitHub username/organization to analyze (defaults to `heyns1000`)

### Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set environment variables (recommended):**
   ```bash
   export GITHUB_TOKEN=your_github_personal_access_token
   export OWNER=heyns1000  # Optional, defaults to heyns1000
   ```

3. **Run the generator:**
   ```bash
   npm run generate-heatmap
   ```

4. **Find the output:**
   The heatmap will be saved to `data/heatmap-<owner>.json` (e.g., `data/heatmap-heyns1000.json`)

### Without GitHub Token

You can run the script without a token, but you may hit GitHub's rate limits:

```bash
npm run generate-heatmap
```

The script will display a warning but continue with unauthenticated requests (limited to 60 requests per hour).

## Running via GitHub Actions

The repository includes a GitHub Actions workflow that runs automatically and can be triggered manually.

### Automatic Runs

The workflow runs daily at 02:00 UTC and generates a heatmap for the default owner (`heyns1000`).

### Manual Trigger

1. Go to the **Actions** tab in your GitHub repository
2. Select **Generate Repository Heatmap** from the workflows list
3. Click **Run workflow**
4. (Optional) Enter a custom owner name
5. Click the green **Run workflow** button

### Downloading the Artifact

After the workflow completes:

1. Go to the workflow run page
2. Scroll to the **Artifacts** section at the bottom
3. Download the `heatmap-<owner>` artifact (a ZIP file)
4. Extract the ZIP to get the JSON file

## How It Works

### Data Collection

For each repository, the script fetches:

1. **Contributors**: All users who have contributed commits
2. **Topics**: Repository topics/tags
3. **Primary Language**: The main programming language
4. **Dependencies**: From `package.json` if available (for Node.js projects)

### Strength Calculation

For each pair of repositories (A, B), the relationship strength is computed as:

```
strength = (
  (shared_contributors / max_contributors) * 0.6 +
  (shared_topics / max_topics) * 0.3 +
  (has_dependency_link ? 1 : 0) * 0.1
)
```

The raw scores are then normalized to a 0-100 scale.

### Influence Score

Each sector (repository) gets an influence score representing its total relationship strength with all other repositories, normalized to 0-100.

### Analytics

- **totalConnections**: Number of repository pairs with strength > 0
- **strongestConnection**: Maximum strength across all pairs
- **averageStrength**: Mean strength across all connections
- **mostInfluentialSector**: Repository with the highest influence score

## Language Emoji Mapping

Repositories are tagged with emojis based on their primary language:

- 🟨 JavaScript
- 🔷 TypeScript  
- 🐍 Python
- ☕ Java
- 🐹 Go
- 🦀 Rust
- 🐘 PHP
- 💎 Ruby
- 🌐 HTML
- 🎨 CSS
- 📦 Other/Unknown

## Rate Limiting

**Authenticated requests**: 5,000 requests per hour  
**Unauthenticated requests**: 60 requests per hour

For organizations with many repositories, it's highly recommended to provide a `GITHUB_TOKEN`.

### Creating a GitHub Token

1. Go to [GitHub Settings > Developer Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Click **Generate new token** (classic)
3. Give it a descriptive name (e.g., "Heatmap Generator")
4. Select scopes: `public_repo` (or `repo` for private repos)
5. Click **Generate token**
6. Copy the token and set it as `GITHUB_TOKEN` environment variable

## Error Handling

The script handles errors gracefully:

- Missing repositories: Continues with available data
- API rate limits: Displays warning and exits
- Missing package.json: Continues without dependency data
- Network errors: Logs warning and continues with remaining repositories

## Troubleshooting

**Issue**: Rate limit exceeded  
**Solution**: Set the `GITHUB_TOKEN` environment variable

**Issue**: No repositories found  
**Solution**: Check the owner name and ensure repositories are public (or token has access)

**Issue**: Module not found error  
**Solution**: Run `npm install` to install dependencies

## Future Enhancements

Potential improvements for future versions:

- Support for additional package managers (pip, cargo, go.mod)
- More sophisticated dependency analysis
- Commit frequency as a relationship factor
- Issue/PR cross-references
- Customizable weights via configuration file
- Automatic commit and push of results

## Support

For issues or questions, please open an issue on GitHub.
