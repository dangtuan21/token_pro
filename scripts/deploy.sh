#!/bin/bash

# Complete Deployment Script
# This script handles both infrastructure setup and frontend deployment

set -e

# Fix PATH to ensure we use the working AWS CLI
export PATH="/opt/homebrew/bin:$PATH"

# Configuration
STACK_NAME="tokenization-infrastructure"
TEMPLATE_FILE=".aws/infrastructure.yml"
REGION="${AWS_REGION:-us-east-1}"
ENVIRONMENT="${ENVIRONMENT:-development}"
PROJECT_NAME="${PROJECT_NAME:-tokenization}"
BUILD_DIR="frontend/dist"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Parse command line arguments
SKIP_INFRASTRUCTURE=false
SKIP_FRONTEND=false
FORCE_INFRASTRUCTURE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-infrastructure)
            SKIP_INFRASTRUCTURE=true
            shift
            ;;
        --skip-frontend)
            SKIP_FRONTEND=true
            shift
            ;;
        --force-infrastructure)
            FORCE_INFRASTRUCTURE=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --skip-infrastructure    Skip infrastructure deployment"
            echo "  --skip-frontend         Skip frontend deployment"
            echo "  --force-infrastructure  Force infrastructure deployment even if stack exists"
            echo "  --help, -h              Show this help message"
            echo ""
            echo "Environment Variables:"
            echo "  AWS_REGION              AWS region (default: us-east-1)"
            echo "  ENVIRONMENT             Environment name (default: development)"
            echo "  PROJECT_NAME            Project name (default: tokenization)"
            echo ""
            echo "Examples:"
            echo "  $0                      Deploy everything"
            echo "  $0 --skip-infrastructure Deploy only frontend"
            echo "  $0 --skip-frontend      Deploy only infrastructure"
            exit 0
            ;;
        *)
            print_error "Unknown option $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

print_status "🚀 Starting deployment process..."
print_status "Environment: $ENVIRONMENT"
print_status "Region: $REGION"
print_status "Project: $PROJECT_NAME"
echo ""

# Check prerequisites
print_status "🔍 Checking prerequisites..."

# Check if we're in the project root directory
if [ ! -d "frontend" ] || [ ! -f "$TEMPLATE_FILE" ]; then
    print_error "Please run this script from the project root directory."
    print_error "Expected structure: frontend/ and .aws/ directories"
    exit 1
fi

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    print_error "AWS credentials are not configured. Please run 'aws configure' first."
    exit 1
fi

# Check if template file exists
if [ ! -f "$TEMPLATE_FILE" ]; then
    print_error "Template file $TEMPLATE_FILE not found!"
    exit 1
fi

print_success "Prerequisites check passed!"
echo ""

# =============================================================================
# INFRASTRUCTURE DEPLOYMENT
# =============================================================================

if [ "$SKIP_INFRASTRUCTURE" = false ]; then
    print_status "🏗️  Infrastructure Deployment Phase"
    
    # Check if stack exists
    STACK_EXISTS=false
    if aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$REGION" &> /dev/null; then
        STACK_EXISTS=true
        if [ "$FORCE_INFRASTRUCTURE" = false ]; then
            print_status "Infrastructure stack already exists. Skipping infrastructure deployment."
            print_status "Use --force-infrastructure to update existing stack."
        else
            print_status "Infrastructure stack exists. Updating..."
            OPERATION="update-stack"
        fi
    else
        print_status "Infrastructure stack does not exist. Creating..."
        OPERATION="create-stack"
    fi
    
    if [ "$STACK_EXISTS" = false ] || [ "$FORCE_INFRASTRUCTURE" = true ]; then
        print_status "Deploying CloudFormation template..."
        
        aws cloudformation $OPERATION \
            --stack-name "$STACK_NAME" \
            --template-body file://"$TEMPLATE_FILE" \
            --parameters \
                ParameterKey=Environment,ParameterValue="$ENVIRONMENT" \
                ParameterKey=ProjectName,ParameterValue="$PROJECT_NAME" \
            --capabilities CAPABILITY_NAMED_IAM \
            --region "$REGION"
        
        if [ $? -eq 0 ]; then
            print_success "CloudFormation $OPERATION initiated successfully!"
            print_status "Waiting for stack $OPERATION to complete..."
            
            # Wait for stack operation to complete
            if [ "$OPERATION" = "create-stack" ]; then
                aws cloudformation wait stack-create-complete --stack-name "$STACK_NAME" --region "$REGION"
            else
                aws cloudformation wait stack-update-complete --stack-name "$STACK_NAME" --region "$REGION"
            fi
            
            if [ $? -eq 0 ]; then
                print_success "Infrastructure deployment completed successfully!"
            else
                print_error "Infrastructure deployment failed!"
                exit 1
            fi
        else
            print_error "Failed to initiate infrastructure deployment!"
            exit 1
        fi
    fi
    
    echo ""
else
    print_warning "Skipping infrastructure deployment (--skip-infrastructure flag)"
    echo ""
fi

# =============================================================================
# FRONTEND DEPLOYMENT
# =============================================================================

if [ "$SKIP_FRONTEND" = false ]; then
    print_status "🎨 Frontend Deployment Phase"
    
    # Verify infrastructure exists
    if ! aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$REGION" &> /dev/null; then
        print_error "Infrastructure stack '$STACK_NAME' not found!"
        print_error "Please deploy infrastructure first or use --force-infrastructure flag."
        exit 1
    fi
    
    # Get stack outputs
    print_status "Retrieving infrastructure information..."
    
    S3_BUCKET=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue' \
        --output text)
    
    CLOUDFRONT_DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
        --output text)
    
    FRONTEND_URL=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`FrontendURL`].OutputValue' \
        --output text)
    
    if [ -z "$S3_BUCKET" ] || [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
        print_error "Failed to retrieve infrastructure information!"
        exit 1
    fi
    
    print_status "S3 Bucket: $S3_BUCKET"
    print_status "CloudFront Distribution ID: $CLOUDFRONT_DISTRIBUTION_ID"
    print_status "Frontend URL: $FRONTEND_URL"
    
    # Build the frontend
    print_status "Building frontend..."
    cd frontend
    if ! bun run build; then
        print_error "Frontend build failed!"
        exit 1
    fi
    cd ..
    
    # Check if build directory exists
    if [ ! -d "$BUILD_DIR" ]; then
        print_error "Build directory '$BUILD_DIR' not found!"
        print_error "Make sure your build script creates a 'dist' directory."
        exit 1
    fi
    
    print_success "Frontend build completed!"
    
    # Deploy to S3
    print_status "Deploying to S3..."
    if aws s3 sync "./$BUILD_DIR" "s3://$S3_BUCKET" --delete --region "$REGION"; then
        print_success "Deployed to S3 successfully!"
    else
        print_error "Failed to deploy to S3!"
        exit 1
    fi
    
    # Invalidate CloudFront cache
    print_status "Invalidating CloudFront cache..."
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
        --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
        --paths "/*" \
        --query 'Invalidation.Id' \
        --output text)
    
    if [ $? -eq 0 ]; then
        print_success "CloudFront invalidation created: $INVALIDATION_ID"
        print_status "Cache invalidation may take 5-15 minutes to complete."
    else
        print_warning "Failed to create CloudFront invalidation, but deployment was successful."
    fi
    
    echo ""
else
    print_warning "Skipping frontend deployment (--skip-frontend flag)"
    echo ""
fi

# =============================================================================
# COMPLETION
# =============================================================================

print_success "🎉 Deployment completed successfully!"
echo ""

if [ "$SKIP_INFRASTRUCTURE" = false ] || [ "$SKIP_FRONTEND" = false ]; then
    # Get final stack outputs
    print_status "📋 Deployment Summary:"
    aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$REGION" \
        --query 'Stacks[0].Outputs' \
        --output table
    
    echo ""
    if [ "$SKIP_FRONTEND" = false ]; then
        print_status "🌐 Your application is available at:"
        echo "   $FRONTEND_URL"
        echo ""
        print_status "📝 Note: CloudFront changes may take a few minutes to propagate globally."
    fi
fi

print_status "🔧 Useful commands:"
echo "   Full deployment:        ./scripts/deploy.sh"
echo "   Frontend only:          ./scripts/deploy.sh --skip-infrastructure"
echo "   Infrastructure only:    ./scripts/deploy.sh --skip-frontend"
echo "   Force infrastructure:   ./scripts/deploy.sh --force-infrastructure"