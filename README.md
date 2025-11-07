# Tokenization Pro

[![Deploy Status](https://github.com/dangtuan21/token_pro/actions/workflows/deploy.yml/badge.svg)](https://github.com/dangtuan21/token_pro/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-000000?style=flat&logo=bun&logoColor=white)](https://bun.sh/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)

A modern tokenization application built with Bun runtime, featuring React frontend and AWS cloud infrastructure.

🔗 **Repository**: [https://github.com/dangtuan21/token_pro](https://github.com/dangtuan21/token_pro)

## � Deployment Guide - 3-Phase Process

### **Phase 1: Deploy Infrastructure** 🏗️

First, deploy the complete AWS infrastructure using CloudFormation:

```bash
# Deploy infrastructure from scratch
cd .aws
aws cloudformation deploy \
  --template-file infrastructure.yml \
  --stack-name tokenization-infrastructure-v2 \
  --parameter-overrides DBPassword=YourSecurePassword123! \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --region us-east-1
```

### **Phase 2: Get Outputs & Update Configuration** ⚙️

After infrastructure deployment, get the outputs and update configuration files:

```bash
# Get key infrastructure outputs
aws cloudformation describe-stacks \
  --stack-name tokenization-infrastructure-v2 \
  --region us-east-1 \
  --query 'Stacks[0].Outputs' \
  --output table

# Key outputs you'll need:
# - LoadBalancerDNS: Update frontend GraphQL endpoint
# - DatabaseEndpoint: Verify task definition has correct DB host
# - FrontendBucketName: Update CI/CD S3 sync target
# - ECRRepositoryURI: For Docker image pushes
```

**Update these configuration files:**

1. **Frontend GraphQL Endpoint** (`frontend/src/graphql.ts`):
   ```typescript
   const GRAPHQL_ENDPOINT = 'http://YOUR_LOAD_BALANCER_DNS/graphql';
   ```

2. **Task Definition Database** (`.aws/task-definition.json`):
   ```json
   {
     "name": "DB_HOST",
     "value": "YOUR_DATABASE_ENDPOINT"
   }
   ```

3. **CI/CD S3 Target** (`.github/workflows/deploy.yml`):
   ```yaml
   aws s3 sync dist/ s3://YOUR_FRONTEND_BUCKET_NAME --delete
   ```

### **Phase 3: Run CI/CD** 🚀

Commit configuration changes to trigger automated deployment:

```bash
# Commit configuration updates
git add .
git commit -m "feat: configure endpoints for fresh infrastructure"
git push origin main

# This triggers GitHub Actions which will:
# 1. Build and test the application
# 2. Build Docker image and push to ECR
# 3. Update ECS task definition
# 4. Deploy to ECS cluster (creates service if needed)
# 5. Deploy frontend to S3
```

**Manual ECS Service Creation** (if first deployment):
```bash
# If the ECS service doesn't exist, create it manually:
aws ecs create-service \
  --cluster tokenization-cluster \
  --service-name tokenization-service \
  --task-definition tokenization-task:latest \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=tokenization-backend,containerPort=3010
```

## 🚀 Infrastructure Status
- **Last Updated**: Wed Nov  6 21:45:40 EST 2025
- **Status**: ✅ All systems operational
- **Database**: PostgreSQL 15.14
- **Infrastructure**: Freshly deployed and validated
- **CI/CD**: Fully automated and working

## ✨ Features

- 🔥 **Ultra-fast** build and runtime with Bun
- ⚛️ **Modern React** frontend with TypeScript
- ☁️ **AWS Cloud** infrastructure with CloudFormation
- 🌐 **Load Balanced** with Application Load Balancer
- 🔒 **Secure** database with proper VPC isolation
- 🚀 **CI/CD Ready** with GitHub Actions
- 📱 **Responsive** design for all devices
- 🛠️ **Developer friendly** with hot reload and fast builds

## 🏗️ Technology Stack

### Frontend
- **Runtime**: [Bun](https://bun.sh/) - Lightning fast JavaScript runtime
- **Framework**: React 18 with TypeScript
- **Build Tool**: Bun's native bundler
- **Styling**: Modern CSS with responsive design

### Backend & Infrastructure  
- **Cloud**: AWS (ECS, RDS, ALB, S3, ECR)
- **Backend**: Bun runtime with GraphQL/TypeScript
- **Database**: PostgreSQL 15.14 with auto-migration
- **Container**: Docker with ECS Fargate
- **Load Balancer**: Application Load Balancer
- **Storage**: S3 with static website hosting
- **CI/CD**: GitHub Actions with automated deployments

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) runtime installed (v1.0 or higher)
- [AWS CLI](https://aws.amazon.com/cli/) configured
- AWS account with appropriate permissions
- Node.js 18+ (for compatibility)

### Clone and Setup
```bash
git clone https://github.com/dangtuan21/token_pro.git
cd token_pro
```

### Development
```bash
# Start frontend development
cd frontend
bun install
bun run dev

# Start backend development
cd backend
bun install
bun run dev
```

### Production Deployment
```bash
# Complete deployment (frontend + backend + infrastructure)
./deploy.sh

# Deploy only frontend
./deploy.sh --skip-backend

# Deploy only backend
./deploy.sh --skip-frontend
```

## 📁 Project Structure

```
tokenization/
├── 📁 frontend/              # React frontend application
│   ├── 📁 src/              # Source code (React components, styles)
│   │   ├── App.tsx          # Main application component  
│   │   ├── TokenManager.tsx # Token management interface
│   │   ├── TokenCard.tsx    # Token display component
│   │   ├── AddTokenModal.tsx# Add token modal component
│   │   └── types.ts         # TypeScript type definitions
│   ├── build.ts             # Bun build configuration
│   ├── package.json         # Frontend dependencies
│   └── README.md            # Frontend documentation
├── 📁 backend/              # Backend API server
│   ├── 📁 src/              # Source code (GraphQL, database)
│   │   ├── database.ts      # Database connection & queries
│   │   ├── resolvers.ts     # GraphQL resolvers
│   │   ├── schema.ts        # GraphQL schema definition
│   │   └── types.ts         # TypeScript type definitions
│   ├── 🐳 Dockerfile        # Container configuration
│   ├── 🗄️ init.sql          # Database initialization
│   ├── index.ts             # Server entry point
│   └── package.json         # Backend dependencies
├── 📁 scripts/              # Deployment and utility scripts
│   ├── deploy.sh            # Complete deployment script (Frontend + Backend)
│   └── README.md            # Scripts documentation
├── 📁 .aws/                 # AWS CloudFormation templates
│   ├── infrastructure.yml   # Complete infrastructure (Frontend + Backend)
│   └── README.md            # AWS setup guide
├── 📁 .github/workflows/    # CI/CD pipelines
│   └── deploy.yml           # GitHub Actions workflow
└── README.md               # This file
```

## 🛠️ Available Commands

### Direct Script Execution
```bash
./deploy.sh                      # Deploy everything
./deploy.sh --skip-infrastructure # Deploy only frontend
./deploy.sh --skip-frontend      # Deploy only infrastructure  
./deploy.sh --force-infrastructure # Force infrastructure update
./deploy.sh --help               # Show help
```

### Frontend Development
```bash
cd frontend
bun run dev                    # Development server
bun run build                  # Production build
```

### Backend Development
```bash
cd backend
bun run dev                    # Development server with hot reload
bun run start                  # Production server
bun run prod                   # Production with NODE_ENV=production
```

### Backend Deployment Commands
```bash
# Deploy everything (infrastructure + containers)
./deploy.sh

# Deploy only frontend (skip backend)
./deploy.sh --skip-backend

# Deploy only backend (skip frontend)
./deploy.sh --skip-frontend

# Force infrastructure update
./deploy.sh --force-update

# Deploy specific image tag
./deploy.sh --image-tag v1.2.3

# Deploy to specific environment
./deploy.sh --environment production
```

## ☁️ AWS Infrastructure

The project uses AWS services for production hosting:

**Frontend Infrastructure:**
- **S3**: Static file hosting
- **CloudFront**: Global CDN and HTTPS termination
- **IAM**: Deployment roles and policies
- **CloudFormation**: Infrastructure as Code

**Backend Infrastructure:**
- **ECS Fargate**: Containerized backend hosting
- **ECR**: Docker container registry
- **Application Load Balancer**: Traffic distribution and health checks
- **VPC**: Network isolation with public/private subnets
- **CloudWatch**: Logging and monitoring
- **Auto Scaling**: Automatic scaling based on CPU/memory

### Infrastructure Features
✅ Global CDN with edge caching  
✅ Automatic HTTPS certificates  
✅ SPA routing support  
✅ Cost-optimized storage lifecycle  
✅ Secure Origin Access Control  
✅ CI/CD ready deployment  

## 🔧 Configuration

### Custom Domain (Optional)
1. Create SSL certificate in AWS Certificate Manager
2. Update CloudFormation parameters:
   ```bash
   export DOMAIN_NAME=your-domain.com
   export CERTIFICATE_ARN=arn:aws:acm:us-east-1:123456789:certificate/abc-123
   ```

## 🚀 Deployment

### First Time Setup
1. **Configure AWS credentials:**
   ```bash
   aws configure
   ```

2. **Deploy everything:**
   ```bash
   ./deploy.sh
   ```

### Regular Updates
```bash
# For frontend changes only
./deploy.sh --skip-infrastructure

# For infrastructure changes
./deploy.sh --skip-frontend --force-infrastructure

# For complete redeployment
./deploy.sh
```

### CI/CD with GitHub Actions
The project includes a comprehensive GitHub Actions workflow for automated testing and deployment:

#### 🔄 Workflow Overview
- **Build & Test**: Type checking, building, and artifact creation
- **Build Backend**: Docker build and ECR push (when backend changes)
- **Deploy**: Automated deployment to AWS (S3 + CloudFront + ECS)
- **Verify**: Post-deployment accessibility testing
- **Notify**: Deployment summary and status reporting

#### 🚀 Automatic Triggers
- **Push to `main`**: Production deployment (frontend + backend)
- **Push to `develop`**: Development deployment (frontend + backend)
- **Pull Request**: Build and test only (no deployment)
- **Manual**: Workflow dispatch with environment options
- **Smart Detection**: Only builds/deploys changed components

#### 🔧 Required GitHub Secrets
Set these in `Settings` → `Secrets and variables` → `Actions`:
- `AWS_ACCESS_KEY_ID` - Your AWS access key
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret key

#### 🛠️ Quick CI/CD Commands
```bash
# Trigger manual deployment
# Go to Actions tab → "Deploy Tokenization Pro" → "Run workflow"

# Check deployment status
# Visit: https://github.com/dangtuan21/token_pro/actions
```

## 📚 Documentation

- [Scripts Documentation](./scripts/README.md)
- [AWS Infrastructure Guide](./.aws/README.md)
- [Frontend Documentation](./frontend/README.md)

## 🔍 Monitoring

After deployment, monitor your application:

- **AWS Console**: CloudFormation, S3, CloudFront
- **CloudWatch**: Metrics and logging
- **Cost Explorer**: Usage and cost tracking

## 🤝 Contributing

1. Fork the repository from [https://github.com/dangtuan21/token_pro](https://github.com/dangtuan21/token_pro)
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test deployment scripts in a development environment
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Test all AWS deployments in development first
- Update documentation for new features
- Ensure backward compatibility

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:

1. **Documentation**: Check the comprehensive docs in each directory
2. **Issues**: Report bugs or request features on [GitHub Issues](https://github.com/dangtuan21/token_pro/issues)
3. **AWS Troubleshooting**: Review CloudFormation events for deployment issues
4. **Credentials**: Verify AWS credentials and permissions
5. **CI/CD**: Check GitHub Actions logs for pipeline issues

### Common Issues
- **Bun not found**: Ensure Bun is installed and in your PATH
- **AWS permissions**: Verify your AWS user has CloudFormation, S3, and CloudFront permissions
- **Build failures**: Check Node.js compatibility and dependency versions# Infrastructure Rebuild Complete - Thu Nov  6 16:35:35 EST 2025
