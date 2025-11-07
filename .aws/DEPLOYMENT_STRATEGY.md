# 🚀 Smart Deployment Strategy

## Problem Solved

Previously, any change (frontend or backend) triggered a full deployment:
- Frontend change → Backend rebuilds unnecessarily (3-5 minutes wasted)
- Backend change → Frontend rebuilds unnecessarily (30 seconds wasted)

## Solution: Path-Based Triggers

### 📁 New Workflow Structure

| Workflow | Triggers | What It Deploys | Duration |
|----------|----------|-----------------|----------|
| `deploy-frontend.yml` | `frontend/**` changes | S3 static site only | ~30 seconds |
| `deploy-backend.yml` | `backend/**`, `.aws/**` | ECS service only | ~3-5 minutes |
| `deploy-full.yml` | Manual trigger or README | Both (optional) | ~3-5 minutes |
| `deploy.yml` | Disabled (legacy) | Emergency only | ~5-7 minutes |

### ⚡ Performance Gains

**Before:**
- Frontend change: 5-7 minutes (full deployment)
- Backend change: 5-7 minutes (full deployment)

**After:**
- Frontend change: 30 seconds (S3 only)
- Backend change: 3-5 minutes (ECS only)

### 🎯 Usage Examples

#### Frontend Development (Fast Iteration)
```bash
# Edit React component
echo "// New feature" >> frontend/src/components/Feature.tsx
git add . && git commit -m "feat: new UI component" && git push

# ✅ Deploys frontend to S3 only (~30s)
# ❌ Skips ECS backend deployment
```

#### Backend Development  
```bash
# Update API endpoint
echo "// New API route" >> backend/src/routes/api.ts
git add . && git commit -m "feat: new API endpoint" && git push

# ✅ Deploys backend to ECS only (~3-5min)
# ❌ Skips frontend S3 deployment
```

#### Manual Full Deployment
```bash
# Go to GitHub Actions → "Deploy Full Stack" → "Run workflow"
# Choose: Deploy backend? ✅ Deploy frontend? ✅
```

## 🔧 Configuration

### Auto-Update S3 Bucket Name
```bash
./scripts/update-bucket-name.sh
```

This script automatically:
1. Fetches S3 bucket name from CloudFormation outputs
2. Updates `deploy-frontend.yml` with correct bucket name
3. Ensures workflows use the right infrastructure

### Manual Configuration Check
```bash
# Verify bucket name in workflow
grep "S3_BUCKET:" .github/workflows/deploy-frontend.yml

# Should show: S3_BUCKET: tokenization-frontend-[account-id]
```

## 📊 Benefits

✅ **85% faster frontend deployments** (30s vs 5-7min)  
✅ **No unnecessary backend rebuilds** on frontend changes  
✅ **Resource efficient** - only rebuilds what changed  
✅ **Better developer experience** - faster feedback loop  
✅ **Parallel development** - frontend and backend teams work independently  
✅ **Manual control** - full deployments when needed  

## 🛠️ Troubleshooting

**Q: Deployment not triggered?**
- Check file paths in commit match workflow triggers
- Verify branch is `main` or `master`

**Q: Wrong S3 bucket name?**
- Run `./scripts/update-bucket-name.sh` 
- Check CloudFormation outputs for correct bucket name

**Q: Need emergency full deployment?**
- Use legacy `deploy.yml` workflow (manual trigger only)
- Or run both workflows manually via GitHub Actions UI