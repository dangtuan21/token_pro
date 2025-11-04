# Tokenization Pro

[![Deploy Status](https://github.com/dangtuan21/token_pro/actions/workflows/deploy.yml/badge.svg)](https://github.com/dangtuan21/token_pro/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-000000?style=flat&logo=bun&logoColor=white)](https://bun.sh/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)

A modern tokenization application built with Bun runtime, featuring React frontend and AWS cloud infrastructure.

🔗 **Repository**: [https://github.com/dangtuan21/token_pro](https://github.com/dangtuan21/token_pro)

## ✨ Features

- 🔥 **Ultra-fast** build and runtime with Bun
- ⚛️ **Modern React** frontend with TypeScript
- ☁️ **AWS Cloud** infrastructure with CloudFormation
- 🌐 **Global CDN** with CloudFront distribution
- 🔒 **Secure** HTTPS with automatic certificates
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
- **Cloud**: AWS (S3, CloudFront, CloudFormation)
- **CDN**: CloudFront with edge caching
- **Security**: IAM roles and Origin Access Control
- **CI/CD**: GitHub Actions

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
```

### Production Deployment
```bash
# Complete deployment (infrastructure + frontend)
./scripts/deploy.sh
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
├── 📁 backend/              # Backend services (future expansion)
├── 📁 scripts/              # Deployment and utility scripts
│   ├── deploy.sh            # Complete deployment script
│   └── README.md            # Scripts documentation
├── 📁 .aws/                 # AWS CloudFormation templates
│   ├── infrastructure.yml   # AWS infrastructure definition
│   └── README.md            # AWS setup guide
├── 📁 .github/workflows/    # CI/CD pipelines
│   └── deploy.yml           # GitHub Actions workflow
└── README.md               # This file
```

## 🛠️ Available Commands

### Direct Script Execution
```bash
./scripts/deploy.sh                      # Deploy everything
./scripts/deploy.sh --skip-infrastructure # Deploy only frontend
./scripts/deploy.sh --skip-frontend      # Deploy only infrastructure  
./scripts/deploy.sh --force-infrastructure # Force infrastructure update
./scripts/deploy.sh --help               # Show help
```

### Frontend Development
```bash
cd frontend
bun run dev                    # Development server
bun run build                  # Production build
```

## ☁️ AWS Infrastructure

The project uses AWS services for production hosting:

- **S3**: Static file hosting
- **CloudFront**: Global CDN and HTTPS termination
- **IAM**: Deployment roles and policies
- **CloudFormation**: Infrastructure as Code

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
   ./scripts/deploy.sh
   ```

### Regular Updates
```bash
# For frontend changes only
./scripts/deploy.sh --skip-infrastructure

# For infrastructure changes
./scripts/deploy.sh --skip-frontend --force-infrastructure

# For complete redeployment
./scripts/deploy.sh
```

### CI/CD with GitHub Actions
The project includes a comprehensive GitHub Actions workflow for automated testing and deployment:

#### 🔄 Workflow Overview
- **Build & Test**: Type checking, building, and artifact creation
- **Deploy**: Automated deployment to AWS (S3 + CloudFront)
- **Verify**: Post-deployment accessibility testing
- **Notify**: Deployment summary and status reporting

#### 🚀 Automatic Triggers
- **Push to `main`**: Production deployment
- **Push to `develop`**: Development deployment  
- **Pull Request**: Build and test only (no deployment)
- **Manual**: Workflow dispatch with environment options

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
- **Build failures**: Check Node.js compatibility and dependency versions