# Deployment Scripts

This directory contains the unified deployment script for the tokenization project.

## Scripts

### `deploy.sh`
A comprehensive deployment script that handles both infrastructure setup and frontend deployment intelligently.

**Features:**
- 🏗️ **Infrastructure Management**: Creates/updates CloudFormation stack
- 🎨 **Frontend Deployment**: Builds and deploys to S3 + CloudFront
- 🧠 **Smart Detection**: Skips infrastructure if already exists
- 🎛️ **Flexible Options**: Command-line flags for different scenarios
- 🔍 **Prerequisites Check**: Validates environment before deployment
- 📊 **Detailed Output**: Shows deployment summary and URLs

**Usage:**
```bash
# Complete deployment (recommended for first time)
./scripts/deploy.sh

# Deploy only frontend (infrastructure already exists)
./scripts/deploy.sh --skip-infrastructure

# Deploy only infrastructure
./scripts/deploy.sh --skip-frontend

# Force infrastructure update even if stack exists
./scripts/deploy.sh --force-infrastructure

# Get help
./scripts/deploy.sh --help
```

**Environment Variables:**
- `AWS_REGION` - AWS region (default: us-east-1)
- `ENVIRONMENT` - Environment name (default: development)  
- `PROJECT_NAME` - Project name (default: tokenization)

## Quick Commands

```bash
# First time setup
./scripts/deploy.sh

# Regular frontend updates
./scripts/deploy.sh --skip-infrastructure

# Infrastructure changes only
./scripts/deploy.sh --skip-frontend --force-infrastructure
```

## Script Intelligence

The script automatically:
- ✅ **Detects existing infrastructure** and skips if not needed
- ✅ **Validates prerequisites** before starting
- ✅ **Handles build failures** gracefully
- ✅ **Waits for CloudFormation** operations to complete
- ✅ **Provides clear feedback** at each step
- ✅ **Shows final URLs** and next steps

## Deployment Phases

### 🔍 Prerequisites Check
- Project structure validation
- AWS CLI installation
- AWS credentials verification
- Template file existence

### 🏗️ Infrastructure Phase
- CloudFormation stack detection
- Stack creation or update
- Wait for completion
- Verify outputs

### 🎨 Frontend Phase
- Infrastructure verification
- Frontend build execution
- S3 file synchronization
- CloudFront cache invalidation

## Permissions Required

Your AWS user/role needs:
- CloudFormation: create/update/delete stacks
- S3: create buckets, upload files, manage policies
- CloudFront: create distributions, invalidate cache
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

**Infrastructure already exists:**
Use `--force-infrastructure` to update existing stack.

**Build failures:**
Check that `bun run build` works in the frontend directory.

**CloudFormation errors:**
Check AWS Console → CloudFormation for detailed error messages.