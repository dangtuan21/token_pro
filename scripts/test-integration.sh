#!/bin/bash

# Full-Stack Integration Test Script
echo "🧪 Testing Full-Stack Integration..."

FRONTEND_URL="https://d3hiuqehgt00bf.cloudfront.net"
BACKEND_URL="http://18.233.9.11:3010/graphql"

echo ""
echo "📱 Frontend URL: $FRONTEND_URL"
echo "🔌 Backend URL: $BACKEND_URL"
echo ""

# Test 1: Frontend accessibility
echo "🌐 Test 1: Frontend Accessibility"
if curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" | grep -q "200"; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend is not accessible"
fi

# Test 2: Backend health
echo ""
echo "💓 Test 2: Backend Health"
if curl -s -o /dev/null -w "%{http_code}" "http://18.233.9.11:3010/" | grep -q "200"; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend is not responding"
fi

# Test 3: GraphQL API
echo ""
echo "🔍 Test 3: GraphQL API"
RESPONSE=$(curl -s -X POST "$BACKEND_URL" \
    -H "Content-Type: application/json" \
    -H "Origin: $FRONTEND_URL" \
    -d '{"query":"query { getAllTokens { id name symbol } }"}')

if echo "$RESPONSE" | grep -q '"data"'; then
    echo "✅ GraphQL API is working"
    echo "📊 Token data:"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
else
    echo "❌ GraphQL API failed"
    echo "Response: $RESPONSE"
fi

# Test 4: CORS Configuration
echo ""
echo "🔒 Test 4: CORS Configuration"
CORS_RESPONSE=$(curl -s -X OPTIONS "$BACKEND_URL" \
    -H "Origin: $FRONTEND_URL" \
    -H "Access-Control-Request-Method: POST" \
    -w "%{http_code}")

if echo "$CORS_RESPONSE" | grep -q "204"; then
    echo "✅ CORS is properly configured"
else
    echo "❌ CORS configuration issue"
fi

echo ""
echo "🎉 Integration test completed!"
echo ""
echo "📋 Summary:"
echo "Frontend: $FRONTEND_URL"
echo "Backend:  $BACKEND_URL"
echo "Status:   Ready for full-stack testing!"