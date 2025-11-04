# Tokenization Pro

A modern tokenization application built with Bun runtime, featuring React frontend and AWS cloud infrastructure.

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) runtime installed
- [AWS CLI](https://aws.amazon.com/cli/) configured
- AWS account with appropriate permissions

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
├── frontend/              # React frontend application
│   ├── src/              # Source code
│   ├── build.ts          # Bun build configuration
│   └── package.json      # Frontend dependencies
├── backend/              # Backend services
├── scripts/              # Deployment scripts
│   ├── deploy.sh         # Complete deployment script
│   └── README.md
├── .aws/                 # AWS CloudFormation templates
│   ├── infrastructure.yml
│   └── README.md
└── .github/workflows/    # CI/CD pipelines
    └── deploy.yml
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

### Environment Variables
Copy `.env.example` to `.env` and configure:

```bash
AWS_REGION=us-east-1
ENVIRONMENT=development
PROJECT_NAME=tokenization
```

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
The project includes GitHub Actions workflows for automated deployment:

- **Infrastructure**: Deployed on changes to `.aws/` directory
- **Frontend**: Deployed on changes to `frontend/` directory
- **Environment**: `main` branch → production, others → development

Required GitHub Secrets:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

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

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test deployment scripts
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the documentation in each directory
2. Review AWS CloudFormation events for deployment issues
3. Verify AWS credentials and permissions
4. Check GitHub Actions logs for CI/CD issues