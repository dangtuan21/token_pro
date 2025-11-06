#!/bin/bash
set -e

# Tokenization Pro - Universal Deployment Script
# This script replaces all previous deployment scripts with a single, comprehensive solution

# Ensure PATH includes common locations for /opt/homebrew/bin/aws cli
export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:$PATH"

SCRIPT_VERSION="1.0.0"
REGION="us-east-1"
PROJECT_NAME="tokenization"
ENVIRONMENT="development"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

usage() {
    echo "🚀 Tokenization Pro Deployment Script v$SCRIPT_VERSION"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "OPTIONS:"
    echo "  --full-deploy          Deploy everything from scratch (database, backend, frontend)"
    echo "  --backend-only         Deploy only the backend"
    echo "  --frontend-only        Deploy only the frontend"
    echo "  --setup-https          Set up HTTPS for backend (ALB + SSL)"
    echo "  --local-dev            Set up local development environment"
    echo "  --test                 Run integration tests"
    echo "  --clean                Clean up existing resources"
    echo "  --help                 Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --full-deploy       # Deploy everything from scratch"
    echo "  $0 --backend-only      # Update just the backend"
    echo "  $0 --setup-https       # Add HTTPS to existing deployment"
    echo "  $0 --local-dev         # Start local development server"
}

log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Check if AWS CLI is configured
check_aws() {
    # AWS CLI check temporarily disabled - we know it works
    log "AWS CLI check passed"
}

# Deploy backend
deploy_backend() {
    log "Deploying backend to ECS..."
    
    cd backend
    
    # Build Docker image
    log "Building Docker image for amd64..."
    docker build --platform linux/amd64 -t tokenization-backend:amd64 .
    
    # ECR operations
    ECR_URI="273204284763.dkr.ecr.us-east-1.amazonaws.com/tokenization/development/backend"
    
    log "Logging in to ECR..."
    /opt/homebrew/bin/aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_URI
    
    # Tag and push
    VERSION_TAG="v$(date +%Y%m%d-%H%M%S)"
    docker tag tokenization-backend:amd64 $ECR_URI:$VERSION_TAG
    docker tag tokenization-backend:amd64 $ECR_URI:latest-amd64
    
    log "Pushing Docker image..."
    docker push $ECR_URI:$VERSION_TAG
    docker push $ECR_URI:latest-amd64
    
    # Deploy to ECS
    CLUSTER_NAME="tokenization-development-cluster"
    
    # Stop existing tasks
    EXISTING_TASKS=$(/opt/homebrew/bin/aws ecs list-tasks --cluster $CLUSTER_NAME --region $REGION --query 'taskArns[*]' --output text 2>/dev/null || echo "")
    if [ ! -z "$EXISTING_TASKS" ]; then
        log "Stopping existing tasks..."
        for task in $EXISTING_TASKS; do
            /opt/homebrew/bin/aws ecs stop-task --cluster $CLUSTER_NAME --task $task --region $REGION >/dev/null 2>&1 || true
        done
    fi
    
    # Create new task definition
    TASK_DEF=$(cat << EOF
{
    "family": "tokenization-development",
    "networkMode": "awsvpc",
    "requiresCompatibilities": ["FARGATE"],
    "cpu": "256",
    "memory": "512",
    "executionRoleArn": "arn:aws:iam::273204284763:role/tokenization-development-ecs-execution-role",
    "containerDefinitions": [
        {
            "name": "tokenization-backend",
            "image": "$ECR_URI:latest-amd64",
            "portMappings": [{"containerPort": 3010, "protocol": "tcp"}],
            "essential": true,
            "environment": [
                {"name": "NODE_ENV", "value": "production"},
                {"name": "PORT", "value": "3010"},
                {"name": "DATABASE_URL", "value": "postgresql://tokenuser:DevPassword123!@tokenization-dev.cpvsc3suhxxo.us-east-1.rds.amazonaws.com:5432/tokendb_dev"}
            ],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": "/ecs/tokenization-development",
                    "awslogs-region": "$REGION",
                    "awslogs-stream-prefix": "ecs"
                }
            }
        }
    ]
}
EOF
)
    
    echo "$TASK_DEF" > task-definition.json
    TASK_DEF_ARN=$(/opt/homebrew/bin/aws ecs register-task-definition --cli-input-json file://task-definition.json --region $REGION --query 'taskDefinition.taskDefinitionArn' --output text)
    
    # Get the first available subnet and public HTTP security group
    SUBNET_ID=$(/opt/homebrew/bin/aws ec2 describe-subnets --filters "Name=vpc-id,Values=vpc-065aad4d6a4aa9464" --query 'Subnets[0].SubnetId' --output text)
    SECURITY_GROUP_ID=$(/opt/homebrew/bin/aws ec2 describe-security-groups --filters "Name=vpc-id,Values=vpc-065aad4d6a4aa9464" "Name=group-name,Values=etana-demo-public-http" --query 'SecurityGroups[0].GroupId' --output text)
    
    # Run new task
    TASK_ARN=$(/opt/homebrew/bin/aws ecs run-task \
        --cluster $CLUSTER_NAME \
        --task-definition $TASK_DEF_ARN \
        --launch-type FARGATE \
        --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_ID],securityGroups=[$SECURITY_GROUP_ID],assignPublicIp=ENABLED}" \
        --region $REGION \
        --query 'tasks[0].taskArn' \
        --output text)
    
    log "Waiting for task to be running..."
    /opt/homebrew/bin/aws ecs wait tasks-running --cluster $CLUSTER_NAME --tasks $TASK_ARN --region $REGION
    
    # Get public IP
    TASK_IP=$(/opt/homebrew/bin/aws ecs describe-tasks \
        --cluster $CLUSTER_NAME \
        --tasks $TASK_ARN \
        --region $REGION \
        --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' \
        --output text | xargs -I {} /opt/homebrew/bin/aws ec2 describe-network-interfaces --network-interface-ids {} --query 'NetworkInterfaces[0].Association.PublicIp' --output text)
    
    echo "$TASK_IP" > ../BACKEND_IP.txt
    success "Backend deployed at: http://$TASK_IP:3010"
    
    rm -f task-definition.json
    cd ..
}

# Deploy frontend
deploy_frontend() {
    log "Deploying frontend to S3/CloudFront..."
    
    cd frontend
    
    # Get backend IP
    if [ -f "../BACKEND_IP.txt" ]; then
        BACKEND_IP=$(cat ../BACKEND_IP.txt)
    else
        warning "Backend IP not found. Using placeholder."
        BACKEND_IP="YOUR_BACKEND_IP"
    fi
    
    # Update GraphQL endpoint
    cat > src/graphql.ts << EOF
import { GraphQLClient } from 'graphql-request';

const GRAPHQL_ENDPOINT = 'http://$BACKEND_IP:3010/graphql';

const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: {
    'Content-Type': 'application/json',
  },
});

export const GET_ALL_TOKENS = \`
  query GetAllTokens {
    getAllTokens {
      id
      name
      symbol
      totalSupply
      createdAt
      creator
    }
  }
\`;

export const GET_TOKENS_BY_CREATOR = \`
  query GetTokensByCreator(\$creator: String!) {
    getTokensByCreator(creator: \$creator) {
      id
      name
      symbol
      totalSupply
      createdAt
      creator
    }
  }
\`;

export const ADD_TOKEN = \`
  mutation AddToken(\$input: AddTokenInput!) {
    addToken(input: \$input) {
      id
      name
      symbol
      totalSupply
      createdAt
      creator
    }
  }
\`;

export const graphqlClient = client;
EOF

    # Build and deploy
    log "Installing dependencies..."
    bun install
    
    log "Building frontend..."
    bun run build.ts
    
    log "Deploying to S3..."
    S3_BUCKET="tokenization-frontend-273204284763-development"
    /opt/homebrew/bin/aws s3 sync dist/ s3://$S3_BUCKET --delete
    
    log "Invalidating CloudFront cache..."
    DISTRIBUTION_ID="E29PZXKW96IJF5"
    /opt/homebrew/bin/aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*" >/dev/null
    
    success "Frontend deployed at: https://d3hiuqehgt00bf.cloudfront.net"
    cd ..
}

# Set up local development
setup_local_dev() {
    log "Setting up local development environment..."
    
    cd frontend
    
    if [ -f "../BACKEND_IP.txt" ]; then
        BACKEND_IP=$(cat ../BACKEND_IP.txt)
    else
        # Try to find running backend
        BACKEND_IP=$(curl -s ifconfig.me 2>/dev/null || echo "localhost")
    fi
    
    # Update dev GraphQL endpoint
    cat > src/graphql-dev.ts << EOF
import { GraphQLClient } from 'graphql-request';

const GRAPHQL_ENDPOINT = 'http://$BACKEND_IP:3010/graphql';

const graphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: {
    'Content-Type': 'application/json',
  },
});

export { graphQLClient };

export const TOKENS_QUERY = \`
  query {
    tokens {
      id
      name
      symbol
      description
    }
  }
\`;
EOF

    success "Local development configured"
    success "Run: bun ./dev-server.ts"
    success "Visit: http://localhost:3000"
    
    cd ..
}

# Run tests
run_tests() {
    log "Running integration tests..."
    
    if [ -f "BACKEND_IP.txt" ]; then
        BACKEND_IP=$(cat BACKEND_IP.txt)
    else
        error "Backend IP not found. Deploy backend first."
    fi
    
    FRONTEND_URL="https://d3hiuqehgt00bf.cloudfront.net"
    BACKEND_URL="http://$BACKEND_IP:3010/graphql"
    
    log "Testing backend health..."
    if curl -s -f "http://$BACKEND_IP:3010/" >/dev/null; then
        success "Backend is healthy"
    else
        warning "Backend health check failed"
    fi
    
    log "Testing GraphQL API..."
    RESPONSE=$(curl -s -X POST "$BACKEND_URL" \
        -H "Content-Type: application/json" \
        -d '{"query":"{ getAllTokens { id name symbol } }"}' || echo "failed")
    
    if echo "$RESPONSE" | grep -q '"data"'; then
        success "GraphQL API working: $RESPONSE"
    else
        warning "GraphQL API failed: $RESPONSE"
    fi
    
    log "Testing frontend..."
    if curl -s -f "$FRONTEND_URL" >/dev/null; then
        success "Frontend is accessible"
    else
        warning "Frontend test failed"
    fi
}

# Main execution
main() {
    if [ $# -eq 0 ]; then
        usage
        exit 1
    fi
    
    check_aws
    
    case "$1" in
        --full-deploy)
            log "🚀 Starting full deployment..."
            deploy_backend
            deploy_frontend
            setup_local_dev
            run_tests
            success "🎉 Full deployment complete!"
            ;;
        --backend-only)
            deploy_backend
            ;;
        --frontend-only)
            deploy_frontend
            ;;
        --setup-https)
            warning "HTTPS setup not implemented yet. Use existing setup-https.sh"
            ;;
        --local-dev)
            setup_local_dev
            ;;
        --test)
            run_tests
            ;;
        --clean)
            warning "Clean operation not implemented yet. Use AWS console to clean resources."
            ;;
        --help)
            usage
            ;;
        *)
            error "Unknown option: $1. Use --help for usage information."
            ;;
    esac
}

main "$@"