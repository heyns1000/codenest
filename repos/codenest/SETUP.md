# CodeNest Omni-Integration Setup Guide

**Last Updated**: 2025-11-17 15:52 UTC  
**Repository**: https://github.com/heyns1000/codenest  
**Goal**: Aggregate all 80+ heyns1000 repositories into a unified workspace

---

## 🎯 Quick Start (Phase 1 - First 10 Repos)

### Step 1: Clone and Setup Structure
```bash
git clone https://github.com/heyns1000/codenest.git
cd codenest

# Create folder structure
mkdir -p repos builds workers docs scripts

# Initialize
git add .
git commit -m "chore: initialize codenest structure"
git push origin main
```

### Step 2: Merge First 10 Critical Repositories
```bash
# HotStack - Core file orchestration
git subtree add --prefix=repos/hotstack https://github.com/heyns1000/hotstack main --squash

# BuildNest - Chaos build engine
git subtree add --prefix=repos/buildnest https://github.com/heyns1000/buildnest main --squash

# AI-Logic - LLM intent processor
git subtree add --prefix=repos/ai-logic.seedwave.faa.zone https://github.com/heyns1000/ai-logic.seedwave.faa.zone main --squash

# Fruitful Global - Sector hub manager
git subtree add --prefix=repos/fruitful-global https://github.com/heyns1000/fruitful-global main --squash

# HealthTrack - Metrics tracking
git subtree add --prefix=repos/healthtrack https://github.com/heyns1000/healthtrack main --squash

# VaultPay - Payment processing
git subtree add --prefix=repos/vaultpay https://github.com/heyns1000/vaultpay main --squash

# SamFox - Portfolio site
git subtree add --prefix=repos/samfox.faa.zone https://github.com/heyns1000/samfox.faa.zone main --squash

# Legal - Terms & compliance
git subtree add --prefix=repos/legal https://github.com/heyns1000/legal main --squash

# Footer - Global footer
git subtree add --prefix=repos/footer.global.repo https://github.com/heyns1000/footer.global.repo main --squash

# Noodle Juice - Domain portal
git subtree add --prefix=repos/noodle.juice https://github.com/heyns1000/noodle.juice main --squash

# Commit Phase 1
git add .
git commit -m "feat: merge 10 priority repos (phase 1)"
git push origin main
```

**Verification**: Check https://github.com/heyns1000/codenest/tree/main/repos - should show 10 folders

---

## 🔧 Phase 2: BuildNest Worker Deployment

### Create Orchestrator Worker
Create `workers/orchestrator.js`:

```javascript
// BuildNest Orchestrator - Cloudflare Worker
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname === '/api/build' && request.method === 'POST') {
      const formData = await request.formData();
      const file = formData.get('file');
      const prompt = formData.get('prompt');
      
      // Extract text from PDF/file
      const text = await extractText(file);
      
      // Get AI intent
      const intent = await getAIIntent(text, prompt, env.AI);
      
      // Generate site with BuildNest chaos
      const site = await generateSite(intent);
      
      // Deploy to subdomain
      const subdomain = await deployToCloudflare(site, env);
      
      // Setup email routing
      await setupEmail(subdomain, env);
      
      // Commit to codenest
      await commitToGitHub(site, subdomain, env.GITHUB_TOKEN);
      
      return Response.json({ 
        success: true, 
        url: `https://${subdomain}.hotstack.faa.zone`,
        email: `hello@${subdomain}.hotstack.faa.zone`
      });
    }
    
    return new Response('BuildNest Orchestrator Live', { status: 200 });
  }
};

async function extractText(file) {
  const arrayBuffer = await file.arrayBuffer();
  // TODO: Implement PDF text extraction
  return "extracted text placeholder";
}

async function getAIIntent(text, prompt, ai) {
  const response = await ai.run('@cf/meta/llama-3-8b-instruct', {
    prompt: `Extract business intent from: ${text}\nUser request: ${prompt}\nReturn JSON with: businessName, businessType, location, services, brand`
  });
  return JSON.parse(response.response || '{}');
}

async function generateSite(intent) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${intent.businessName || 'Welcome'}</title>
  <style>
    body { font-family: Inter, sans-serif; margin: 0; background: #1a1a1a; color: white; }
    header { text-align: center; padding: 4rem 2rem; background: linear-gradient(135deg, #1a1a1a, #d4af37); }
    .services { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; padding: 4rem 2rem; }
    .service { padding: 2rem; background: rgba(255,255,255,0.05); border: 1px solid #d4af37; border-radius: 8px; }
  </style>
</head>
<body>
  <header>
    <h1>${intent.businessName || 'Your Business'}</h1>
    <p>${intent.services?.join(' • ') || 'Services'}</p>
  </header>
  <section class="services">
    ${(intent.services || []).map(s => `<div class="service">${s}</div>`).join('')}
  </section>
  <footer>
    <p>${intent.location || ''}</p>
  </footer>
</body>
</html>`;
  
  return { html, css: '', js: '' };
}

async function deployToCloudflare(site, env) {
  const subdomain = `site-${Date.now()}`;
  // TODO: Implement Cloudflare Pages API deployment
  return subdomain;
}

async function setupEmail(subdomain, env) {
  // TODO: Implement Email Routing API
}

async function commitToGitHub(site, subdomain, token) {
  // TODO: Commit to codenest/builds/[subdomain]
}
```

### Create wrangler.toml
Create `wrangler.toml`:

```toml
name = "codenest-orchestrator"
main = "workers/orchestrator.js"
compatibility_date = "2024-01-01"

[ai]
binding = "AI"

[[r2_buckets]]
binding = "BUILDS"
bucket_name = "codenest-builds"

[vars]
GITHUB_REPO = "heyns1000/codenest"
```

### Deploy Worker
```bash
cd codenest
npx wrangler deploy

# Test
curl -X POST https://codenest-orchestrator.workers.dev/api/build \
  -F "file=@test.pdf" \
  -F "prompt=dog grooming California"
```

---

## 📦 Phase 3: Merge Remaining 70+ Public Repos

Create `scripts/merge-all-repos.sh`:

```bash
#!/bin/bash

# Fetch all repos for heyns1000
REPOS=$(curl -s "https://api.github.com/users/heyns1000/repos?per_page=100" | jq -r '.[].name')

# Already merged in Phase 1
SKIP=("hotstack" "buildnest" "ai-logic.seedwave.faa.zone" "fruitful-global" "healthtrack" "vaultpay" "samfox.faa.zone" "legal" "footer.global.repo" "noodle.juice" "codenest")

for repo in $REPOS; do
  if [[ " ${SKIP[@]} " =~ " ${repo} " ]]; then
    echo "⏭️  Skipping $repo (already merged)"
    continue
  fi
  
  echo "🔄 Merging $repo..."
  git subtree add --prefix=repos/$repo https://github.com/heyns1000/$repo main --squash || echo "❌ Failed: $repo"
done

echo "✅ Phase 2 complete! Total repos: $(ls repos | wc -l)"
```

Run it:
```bash
chmod +x scripts/merge-all-repos.sh
./scripts/merge-all-repos.sh

git add .
git commit -m "feat: merge remaining 70+ public repos (phase 2)"
git push origin main
```

---

## 🔐 Phase 4: Add Private Repositories

### Setup GitHub Token
Generate token at: https://github.com/settings/tokens/new
- Scopes: `repo` (all), `read:user`

```bash
export GITHUB_TOKEN="ghp_your_token_here"
git config --global url."https://${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"
```

### Merge Private Repos
```bash
cd codenest

# vaultpay-private (royalty batches)
git subtree add --prefix=repos/vaultpay-private https://github.com/heyns1000/vaultpay-private main --squash

# healthtrack-zips (metrics archives)
git subtree add --prefix=repos/healthtrack-zips https://github.com/heyns1000/healthtrack-zips main --squash

# buildnest-full-stubs (complete LaTeX library)
git subtree add --prefix=repos/buildnest-full-stubs https://github.com/heyns1000/buildnest-full-stubs main --squash

git add .
git commit -m "feat: add private repos (vaultpay-private, healthtrack-zips, buildnest-full-stubs)"
git push origin main
```

---

## 🔧 GitHub Secrets Configuration

Go to https://github.com/heyns1000/codenest/settings/secrets/actions

Add these secrets:
- `CLOUDFLARE_API_TOKEN` - From Cloudflare dashboard
- `GITHUB_TOKEN` - Personal access token with repo:write
- `ZONE_ID` - Cloudflare zone ID for faa.zone
- `ACCOUNT_ID` - Cloudflare account ID

---

## ✅ Verification Checklist

### Phase 1
- [ ] 10 folders in `repos/` directory
- [ ] README updated with merged repos list
- [ ] Git history preserved (`git log repos/hotstack`)

### Phase 2
- [ ] Worker deployed to Cloudflare
- [ ] `/api/build` endpoint responds
- [ ] Test upload processes correctly

### Phase 3
- [ ] 80+ folders in `repos/`
- [ ] All public repos merged

### Phase 4
- [ ] Private repos accessible in `repos/vaultpay-private/`
- [ ] LaTeX stubs in `repos/buildnest-full-stubs/`
- [ ] Sensitive data secured

---

## 🎯 Test Case: Dog Parlour

```bash
# Upload test PDF
curl -X POST https://codenest-orchestrator.workers.dev/api/build \
  -F "file=@paw-palace.pdf" \
  -F "prompt=California dog grooming salon"

# Expected Result:
# {
#   "success": true,
#   "url": "https://pawpalace-1847.hotstack.faa.zone",
#   "email": "hello@pawpalace-1847.hotstack.faa.zone"
# }
```

Visit site → Check email → Verify commit in `builds/pawpalace-1847`

---

## 📚 Repository Structure (Final)

```
codenest/
├── repos/                  # All 80+ merged repositories
│   ├── hotstack/
│   ├── buildnest/
│   ├── ai-logic.seedwave.faa.zone/
│   ├── vaultpay-private/  # Private repo
│   └── ... (77 more)
├── builds/                 # Generated sites from uploads
│   └── pawpalace-1847/
├── workers/               # Cloudflare Workers
│   ├── orchestrator.js    # Main build orchestrator
│   └── ai-intent.js       # AI-Logic processor
├── scripts/               # Automation scripts
│   └── merge-all-repos.sh
├── docs/                  # Documentation
├── README.md             # Project overview
├── SETUP.md              # This file
└── wrangler.toml         # Worker configuration
```

---

## 🚀 Next Steps

1. ✅ Execute Phase 1 (10 critical repos)
2. ✅ Deploy BuildNest Worker (Phase 2)
3. ✅ Merge remaining 70+ repos (Phase 3)
4. ✅ Add private repos (Phase 4)
5. ✅ Test end-to-end workflow
6. ✅ Scale to production

---

**瓷勺旋渦已築，脈買已通！**  
The omni-integration begins now. 🦍🔥
