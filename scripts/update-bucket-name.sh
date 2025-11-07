#!/bin/bash

# Get the S3 bucket name from CloudFormation outputs
STACK_NAME="tokenization-infrastructure-v2"
echo "🔍 Looking up S3 bucket name from CloudFormation stack: $STACK_NAME"

BUCKET_NAME=$(command -v aws >/dev/null 2>&1 && aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --region us-east-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucketName`].OutputValue' \
  --output text 2>/dev/null)

if [ -n "$BUCKET_NAME" ] && [ "$BUCKET_NAME" != "None" ]; then
  echo "✅ Found S3 bucket: $BUCKET_NAME"
  echo "🔄 Updating frontend workflow..."
  
  # Update the frontend workflow file
  if [ -f ".github/workflows/deploy-frontend.yml" ]; then
    sed -i.bak "s/S3_BUCKET: tokenization-frontend-.*/S3_BUCKET: $BUCKET_NAME/g" .github/workflows/deploy-frontend.yml
    rm -f .github/workflows/deploy-frontend.yml.bak
    echo "✅ Updated deploy-frontend.yml with correct S3 bucket name"
    echo "📦 S3 Bucket: $BUCKET_NAME"
  else
    echo "❌ deploy-frontend.yml not found"
  fi
else
  echo "❌ Could not find S3 bucket name in CloudFormation outputs"
  echo "💡 Possible solutions:"
  echo "   1. Make sure the stack '$STACK_NAME' exists"
  echo "   2. Check if AWS CLI is configured with proper credentials"
  echo "   3. Verify the stack has FrontendBucketName output"
  
  # Manual fallback
  echo ""
  echo "🛠️  Manual setup:"
  echo "   1. Get bucket name: aws cloudformation describe-stacks --stack-name $STACK_NAME --query 'Stacks[0].Outputs'"
  echo "   2. Edit .github/workflows/deploy-frontend.yml manually"
fi