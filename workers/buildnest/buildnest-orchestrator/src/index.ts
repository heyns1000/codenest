/**
 * BUILDNEST ORCHESTRATOR - Phase 2 Production
 * User: heyns1000 | Repo: codenest
 * Handles: GitHub webhook → Build trigger → Status tracking
 */

export interface Env {
  BUILDNEST_KV: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // CORS headers for all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // GitHub webhook endpoint
    if (url.pathname === '/webhook' && request.method === 'POST') {
      try {
        const payload = await request.json() as any;
        
        if (payload.ref === 'refs/heads/main') {
          const buildId = crypto.randomUUID();
          const buildData = {
            buildId,
            repo: payload.repository.full_name,
            commit: payload.after,
            commitMessage: payload.head_commit?.message || 'No message',
            pusher: payload.pusher?.name || 'unknown',
            timestamp: new Date().toISOString(),
            status: 'queued',
            phase: 2
          };
          
          // Store build in KV namespace
          await env.BUILDNEST_KV.put(`build:${buildId}`, JSON.stringify(buildData), {
            expirationTtl: 86400 * 30 // 30 days retention
          });
          console.log('Build triggered and stored in KV:', buildData);
          
          return new Response(JSON.stringify({
            success: true,
            ...buildData
          }), {
            status: 200,
            headers: corsHeaders
          });
        }
        
        return new Response(JSON.stringify({
          success: false,
          message: 'Not a main branch push'
        }), {
          status: 200,
          headers: corsHeaders
        });
      } catch (error) {
        return new Response(JSON.stringify({
          success: false,
          error: (error as Error).message
        }), {
          status: 400,
          headers: corsHeaders
        });
      }
    }
    
    // Get build by ID
    if (url.pathname.startsWith('/build/')) {
      const buildId = url.pathname.split('/')[2];
      const buildData = await env.BUILDNEST_KV.get(`build:${buildId}`);
      
      if (buildData) {
        return new Response(buildData, { headers: corsHeaders });
      }
      
      return new Response(JSON.stringify({
        error: 'Build not found'
      }), {
        status: 404,
        headers: corsHeaders
      });
    }
    
    // Status endpoint
    if (url.pathname === '/status') {
      return new Response(JSON.stringify({
        service: 'BuildNest Orchestrator',
        user: 'heyns1000',
        repo: 'codenest',
        codenest_repos: 9,
        phase: 2,
        status: 'operational',
        kv_enabled: true,
        version: 'd6059cee-08fc-4742-8757-25d6a8e66ccd',
        timestamp: new Date().toISOString(),
        endpoints: {
          webhook: '/webhook (POST)',
          status: '/status (GET)',
          health: '/health (GET)',
          build: '/build/:id (GET)'
        }
      }), {
        headers: corsHeaders
      });
    }
    
    // Health check
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        healthy: true,
        uptime: 'operational',
        kv_connected: true,
        timestamp: new Date().toISOString()
      }), {
        headers: corsHeaders
      });
    }
    
    // Root endpoint
    return new Response(JSON.stringify({
      service: 'BuildNest Orchestrator',
      message: '🔥 PHASE 2 + KV STORAGE - heyns1000/codenest 🔥',
      user: 'heyns1000',
      repo: 'https://github.com/heyns1000/codenest',
      status: 'operational',
      codenest_repos: 9,
      kv_storage: 'enabled',
      retention: '30 days',
      integrated_systems: [
        'HotStack (file orchestration)',
        'BuildNest (chaos builds)',
        'AI-Logic (intent processing)',
        'VaultPay (payments)',
        'Legal (compliance)',
        'Footer.global.repo (shared components)',
        'Noodle.juice (domain portal)',
        'SamFox (portfolio)',
        'Fruitfulglobal (sector hub)'
      ],
      endpoints: {
        webhook: 'POST /webhook',
        status: 'GET /status',
        health: 'GET /health',
        build: 'GET /build/:id'
      },
      timestamp: new Date().toISOString()
    }), {
      headers: corsHeaders
    });
  }
};
