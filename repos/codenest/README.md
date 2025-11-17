# CodeNest - Unified HotStack Ecosystem

**Omni-integration workspace for all 80+ heyns1000 repositories**

## 🎯 Purpose

CodeNest aggregates the complete Fruitful/HotStack/Banimal ecosystem into a single source of truth:
- **Zero-signup instant builds** (<3 min from upload to live site)
- **AI-powered intent processing** (drop file + prompt → generated site)
- **Global sector mapping** (35 Fruitful hubs across continents)
- **VaultMesh synchronization** (9-second pulse for HealthTrack/royalties/glyphs)

## 📁 Structure

```
codenest/
├── repos/           # All 80+ merged repositories
│   ├── hotstack/
│   ├── buildnest/
│   ├── ai-logic/
│   ├── vaultpay/
│   └── ...
├── builds/          # Generated sites from upload workflow
├── workers/         # Cloudflare Worker orchestrators
└── docs/            # Documentation
```

## 🚀 Workflow

1. **Upload** file + prompt at hotstack.faa.zone
2. **Extract** text from PDF/document
3. **Process** intent via AI-Logic (Grok/Claude)
4. **Generate** site with BuildNest chaos engine
5. **Deploy** to subdomain (e.g., pawpalace-1847.hotstack.faa.zone)
6. **Create** email routing (hello@subdomain)
7. **Commit** to codenest/builds/[project]

## 🌍 Sectors

- **Finance**: VaultPay, ScrollClaims™ royalties
- **Health**: HealthTrack metrics sync
- **Legal**: Treaty glyphs, legal frameworks
- **Build**: BuildNest chaos generation
- **AI**: AI-Logic intent processor
- **Global**: 35 Fruitful sector hubs

## 🔧 Setup

```bash
# Clone
git clone https://github.com/heyns1000/codenest.git
cd codenest

# Deploy orchestrator
cd workers
wrangler deploy orchestrator.js

# Configure secrets
wrangler secret put CLOUDFLARE_API_TOKEN
wrangler secret put GITHUB_TOKEN
wrangler secret put ZONE_ID
wrangler secret put AI_API_KEY
```

## 📊 Status

- **Repos merged**: 0/80+ (in progress)
- **Phase 1**: 10 critical repos
- **Phase 2**: Remaining 70+ repos
- **Private repos**: 3 (vaultpay-private, healthtrack-zips, buildnest-full-stubs)

## 🧪 Test

Drop "Paw Palace dog parlour California.pdf" → Live at pawpalace-1847.hotstack.faa.zone

---

**License**: MASTERED (enforced globally)  
**Pulse**: 9-second VaultMesh sync  
**Time**: <3 min zero-signup builds

瓷勺旋渦已築，脈買已通！ 🦍🔥
# BuildNest Orchestrator - Phase 2 Complete

✅ Worker deployed: buildnest-orchestrator.heynsschoeman.workers.dev
✅ GitHub webhook connected
✅ Automatic build triggers enabled
# BuildNest Orchestrator - Phase 2 Complete

✅ Worker deployed: buildnest-orchestrator.heynsschoeman.workers.dev
✅ GitHub webhook connected and tested
✅ Automatic build triggers enabled
✅ Live log streaming operational

## Live Endpoints
- Root: https://buildnest-orchestrator.heynsschoeman.workers.dev/
- Status: https://buildnest-orchestrator.heynsschoeman.workers.dev/status
- Health: https://buildnest-orchestrator.heynsschoeman.workers.dev/health
- Webhook: https://buildnest-orchestrator.heynsschoeman.workers.dev/webhook

## Integrated Systems (9 repos)
1. HotStack - File orchestration engine
2. BuildNest - Chaos build system
3. AI-Logic - Intent processing
4. VaultPay - Payment processing
5. Legal - Compliance framework
6. Footer.global.repo - Shared components
7. Noodle.juice - Domain portal
8. SamFox - Portfolio site
9. Fruitfulglobal - Sector hub manager
## KV Storage Test
BuildNest now persists all build data for 30 days.
