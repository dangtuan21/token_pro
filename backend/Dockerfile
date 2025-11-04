# Multi-stage Dockerfile for Bun backend
# Optimized for production deployment on AWS ECS

# Stage 1: Dependencies installation
FROM oven/bun:1 AS dependencies
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Stage 2: Build stage
FROM oven/bun:1 AS build
WORKDIR /app

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build step (if you have a build process)
# RUN bun run build

# Stage 3: Production runtime
FROM oven/bun:1 AS runtime
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 bunuser

# Copy only production dependencies and built application
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/src ./src
COPY --from=build /app/index.ts ./
COPY --from=build /app/package.json ./

# Set ownership to non-root user
RUN chown -R bunuser:nodejs /app
USER bunuser

# Expose the port your app runs on
EXPOSE 3010

# Health check for ECS
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3010/ || exit 1

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["bun", "run", "index.ts"]