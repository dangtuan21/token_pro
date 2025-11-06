# Scripts Directory

This directory contains utility scripts for Tokenization Pro.

## Main Deployment Script

**`../deploy.sh`** - Universal deployment script (moved to root directory):

```bash
# Deploy everything from scratch
./deploy.sh --full-deploy

# Deploy only backend
./deploy.sh --backend-only

# Deploy only frontend  
./deploy.sh --frontend-only

# Set up local development
./deploy.sh --local-dev

# Run integration tests
./deploy.sh --test
```

## Utility Scripts

- **`test-integration.sh`** - Standalone integration testing script

## Usage Examples

### Quick Start (Deploy Everything)
```bash
./deploy.sh --full-deploy
```

### Development Workflow
```bash
# Make backend changes
./deploy.sh --backend-only

# Make frontend changes  
./deploy.sh --frontend-only

# Test locally
./deploy.sh --local-dev
# Then visit: http://localhost:3000
```

### Test Integration
```bash
# Use main script
./deploy.sh --test

# Or standalone script
./scripts/test-integration.sh
```

## Cleanup Complete

All redundant scripts have been removed:
- ✅ **Main deployment**: `./deploy.sh` (universal script in root)
- ✅ **Testing**: `./scripts/test-integration.sh` (standalone utility)
- ❌ **Removed**: All duplicate and redundant deployment scripts

**Result**: Clean, minimal script organization with clear responsibilities.

**Features:**
- 🏗️ **Complete Infrastructure**: Creates frontend (S3/CloudFront) + backend (ECS/ALB/VPC) in one stack
- 🎨 **Frontend Deployment**: Builds and deploys React app to S3 + CloudFront
- 🐳 **Backend Deployment**: Builds Docker image, pushes to ECR, deploys to ECS Fargate
- 🧠 **Smart Detection**: Environment-aware configurations (dev vs production)
- 🎛️ **Flexible Options**: Command-line flags for different deployment scenarios
- 🔍 **Prerequisites Check**: Validates environment before deployment
- 📊 **Detailed Output**: Shows deployment summary and URLs

**Usage:**
```bash
# Complete deployment (recommended for first time)
./scripts/deploy.sh

# Deploy only frontend (backend already exists)
./scripts/deploy.sh --skip-backend

# Deploy only backend (frontend already exists)
./scripts/deploy.sh --skip-frontend

# Force infrastructure update even if stack exists
./scripts/deploy.sh --force-update

# Deploy specific backend image tag
./scripts/deploy.sh --image-tag v1.2.3

# Deploy to production environment
./scripts/deploy.sh --environment production

# Get help
./scripts/deploy.sh --help
```

**Environment Variables:**
- `AWS_REGION` - AWS region (default: us-east-1)
- `ENVIRONMENT` - Environment name (default: development)  
- `PROJECT_NAME` - Project name (default: tokenization)
- `IMAGE_TAG` - Docker image tag (default: latest)

## Quick Commands

```bash
# First time setup
./scripts/deploy.sh

# Regular updates (both frontend and backend)
./scripts/deploy.sh --force-update

# Frontend-only updates
./scripts/deploy.sh --skip-backend

# Backend-only updates
./scripts/deploy.sh --skip-frontend
```

## Script Intelligence

The script automatically:
- ✅ **Detects existing infrastructure** and updates it appropriately
- ✅ **Validates prerequisites** before starting (AWS CLI, Docker, credentials)
- ✅ **Handles build failures** gracefully for both frontend and backend
- ✅ **Waits for CloudFormation** operations to complete
- ✅ **Provides clear feedback** at each step
- ✅ **Shows final URLs** for both frontend and backend
- ✅ **Environment-aware deployment** (different configs for dev/prod)

## Deployment Phases

### 🔍 Prerequisites Check
- Project structure validation
- AWS CLI installation
- Docker installation and running
- AWS credentials verification
- Template file existence

### 🏗️ Infrastructure Phase
- CloudFormation stack detection
- Complete infrastructure creation/update (VPC, ECS, S3, CloudFront, etc.)
- Wait for completion
- Verify outputs

### 🎨 Frontend Phase (if not skipped)
- Frontend build execution (Bun + React)
- S3 file synchronization
- CloudFront cache invalidation

### 🐳 Backend Phase (if not skipped)
- Docker image build
- ECR login and push
- ECS service update (force new deployment)

## Permissions Required

Your AWS user/role needs:
- CloudFormation: create/update/delete stacks
- S3: create buckets, upload files, manage policies
- CloudFront: create distributions, invalidate cache
- ECS: create clusters, services, task definitions
- ECR: create repositories, push/pull images
- EC2: create VPCs, subnets, security groups, load balancers
- IAM: create roles and policies

## Troubleshooting

**Script not executable:**
```bash
chmod +x scripts/deploy.sh
```

**AWS credentials not found:**
```bash
aws configure
# or
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
```

**Docker not running:**
```bash
# Start Docker Desktop or Docker daemon
sudo systemctl start docker  # Linux
```

**Frontend build failures:**
Check that `bun run build` works in the frontend directory.

**Backend build failures:**
Check that Docker can build in the backend directory:
```bash
cd backend && docker build -t test .
```

**CloudFormation errors:**
Check AWS Console → CloudFormation for detailed error messages.

**ECS deployment issues:**
- Check ECS Console for task failures
- Verify ECR repository exists and has images
- Check CloudWatch logs for container errors