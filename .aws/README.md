# Infrastructure

This directory contains CloudFormation templates and documentation for the complete AWS infrastructure setup.

## Architecture

- **S3 Bucket**: Hosts static files (HTML, CSS, JS, images)
- **CloudFront**: CDN for global distribution and HTTPS termination
- **Origin Access Control (OAC)**: Secure access from CloudFront to S3
- **IAM Role**: Deployment permissions for CI/CD

## Prerequisites

1. **AWS CLI**: Install and configure with appropriate credentials
   ```bash
   aws configure
   ```

2. **Permissions**: Your AWS user/role needs:
   - CloudFormation full access
   - S3 full access
   - CloudFront full access
   - IAM role creation permissions

## Quick Start

### 1. Deploy Infrastructure

```bash
# From the tokenization root directory
./scripts/deploy-infrastructure.sh
```

This creates:
- S3 bucket for static hosting
- CloudFront distribution with proper caching
- IAM roles for deployment
- All necessary security policies

### 2. Build and Deploy Frontend

```bash
# From the project root directory
./scripts/deploy-frontend.sh

# Or using npm script from frontend directory
cd frontend
bun run deploy
```

This will:
- Build the frontend using Bun
- Sync files to S3
- Invalidate CloudFront cache
- Provide the live URL

## Manual Deployment

If you prefer manual control:

```bash
# 1. Build frontend
cd frontend
bun run build

# 2. Get S3 bucket name from CloudFormation
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name tokenization-frontend \
  --query 'Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue' \
  --output text)

# 3. Deploy to S3
aws s3 sync ./dist s3://$BUCKET_NAME --delete

# 4. Invalidate CloudFront cache
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name tokenization-frontend \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
  --output text)

aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
```

## Configuration

### Environment Variables

You can customize the deployment using environment variables:

```bash
export AWS_REGION=us-east-1          # AWS region (default: us-east-1)
export ENVIRONMENT=development       # Environment name (default: development)
export PROJECT_NAME=tokenization     # Project name (default: tokenization)
```

### Custom Domain (Optional)

To use a custom domain:

1. **Create SSL Certificate** in AWS Certificate Manager (us-east-1 for CloudFront)
2. **Update deployment script** with domain parameters:

```bash
aws cloudformation update-stack \
  --stack-name tokenization-frontend \
  --template-body file://.aws/frontend-s3-infrastructure.yml \
  --parameters \
      ParameterKey=Environment,ParameterValue="production" \
      ParameterKey=ProjectName,ParameterValue="tokenization" \
      ParameterKey=DomainName,ParameterValue="your-domain.com" \
      ParameterKey=CertificateArn,ParameterValue="arn:aws:acm:us-east-1:123456789:certificate/abc-123" \
  --capabilities CAPABILITY_NAMED_IAM
```

3. **Update DNS** to point to CloudFront distribution

## File Structure

```
.aws/
├── infrastructure.yml           # CloudFormation template
└── README.md                   # This file

scripts/
├── deploy.sh                   # Complete deployment script
└── README.md

frontend/
├── build.ts                    # Bun build configuration
├── dist/                       # Build output (created by build)
└── src/                        # Source files
```

## Stack Outputs

After deployment, the stack provides these outputs:

- **S3BucketName**: Bucket name for uploads
- **CloudFrontDistributionId**: For cache invalidation
- **FrontendURL**: Live website URL
- **DeploymentRoleArn**: IAM role for CI/CD
- **DeployCommand**: Ready-to-use deployment command

## Troubleshooting

### Build Issues

1. **Build directory not found**: Ensure `bun run build` creates a `dist` folder
2. **Permission errors**: Check AWS credentials and IAM permissions
3. **Stack not found**: Run infrastructure deployment first

### CloudFront Issues

1. **Changes not visible**: CloudFront cache invalidation takes 5-15 minutes
2. **403/404 errors**: Check S3 bucket policy and file paths
3. **HTTPS issues**: Verify certificate configuration for custom domains

### S3 Issues

1. **Access denied**: Check bucket policy and IAM roles
2. **CORS errors**: Template includes CORS configuration
3. **Large files**: Consider S3 multipart upload for files >100MB

## Cost Optimization

- **S3 Storage**: ~$0.023/GB/month
- **CloudFront**: Free tier includes 1TB transfer, then ~$0.085/GB
- **Additional features**: Lifecycle policies included for cost management

## Security Features

- Origin Access Control (OAC) prevents direct S3 access
- HTTPS-only via CloudFront
- No public S3 bucket access
- IAM least-privilege deployment roles

## Monitoring

AWS Console locations for monitoring:
- **S3**: Storage usage and access logs
- **CloudFront**: Distribution metrics and cache hit ratio
- **CloudFormation**: Stack status and drift detection
- **CloudWatch**: Detailed metrics and alarms