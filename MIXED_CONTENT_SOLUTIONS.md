# Mixed Content Issue Solutions

## Problem Summary
The frontend is deployed on HTTPS (CloudFront) but the backend is only available on HTTP. Modern browsers block mixed content (HTTPS pages accessing HTTP resources) for security reasons.

## Current Status
✅ **Backend**: Running on ECS at `http://18.233.9.11:3010/graphql`
✅ **Frontend**: Deployed at `https://d3hiuqehgt00bf.cloudfront.net`
❌ **Integration**: Blocked by mixed content policy

## Available Solutions

### 1. Development Testing (Immediate)
**URL**: `http://localhost:3000`
**Status**: ✅ Ready to use

```bash
cd /Users/tuandang/personal/research/bun/tokenization/frontend
bun dev-server.ts
```

This runs the frontend on HTTP locally, allowing it to connect to the HTTP backend without mixed content issues.

### 2. Debug Pages (Available Now)
- **Debug Page**: `https://d3hiuqehgt00bf.cloudfront.net/debug.html`
- **Proxy Page**: `https://d3hiuqehgt00bf.cloudfront.net/proxy.html`

These pages explain the issue and provide connection testing tools.

### 3. Production HTTPS Solutions (Choose One)

#### Option A: Application Load Balancer with SSL
**Best for**: Production deployments
**Time**: 30-60 minutes setup
**Script**: `./scripts/setup-https.sh`

Sets up ALB with SSL termination to provide HTTPS endpoint for backend.

#### Option B: CloudFront Distribution for Backend
**Best for**: Global distribution
**Time**: 15-20 minutes deployment
**Script**: `./scripts/setup-cloudfront-proxy.sh`

Creates CloudFront distribution to proxy backend through HTTPS.

#### Option C: ACM Certificate + ALB
**Best for**: Custom domain
**Time**: DNS validation required
**Manual setup**: AWS Certificate Manager + ALB

## Recommended Next Steps

### For Immediate Testing
1. Use the development server:
   ```bash
   bun dev-server.ts
   ```
2. Open `http://localhost:3000`
3. Test full-stack functionality

### For Production
1. Set up Application Load Balancer with SSL:
   ```bash
   ./scripts/setup-https.sh
   ```
2. Update frontend GraphQL endpoint to use ALB URL
3. Redeploy frontend with new endpoint

## Current Backend Data
The backend is returning real data from the database:
- **RDS Token**: From PostgreSQL database
- **Sample Token**: Test data

Connection tested via:
```bash
curl -X POST http://18.233.9.11:3010/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ tokens { id name symbol description } }"}'
```

## Files Created
- `scripts/setup-dev-frontend.sh` - Development frontend setup
- `scripts/setup-https.sh` - Production HTTPS via ALB
- `scripts/setup-cloudfront-proxy.sh` - HTTPS via CloudFront
- `frontend/dev-server.ts` - Local development server
- `frontend/public/debug.html` - Diagnostic page
- `frontend/public/proxy.html` - Proxy attempt (CORS limited)

## Summary
The mixed content issue has been identified and multiple solutions provided. The development server is ready for immediate testing, and production HTTPS solutions are scripted and ready to deploy.