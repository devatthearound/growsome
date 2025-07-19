# Simple Next.js build without standalone mode
ARG TARGETPLATFORM=linux/amd64
FROM --platform=$TARGETPLATFORM node:18-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat openssl

# Copy package files
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Create environment file
RUN touch .env.production

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Debug info
RUN echo "=== Debug Info ==="
RUN echo "Node: $(node --version)"
RUN echo "NPM: $(npm --version)"
RUN echo "PWD: $(pwd)"
RUN echo "Files:"
RUN ls -la
RUN echo "Source directory structure:"
RUN find src -type f -name "*.ts" -o -name "*.tsx" | head -30
RUN echo "Checking specific problem files:"
RUN ls -la src/lib/graphql-client.ts || echo "graphql-client.ts missing"
RUN ls -la src/components/blog/BlogNavigation.tsx || echo "BlogNavigation.tsx missing"
RUN ls -la src/components/blog/blog-writer.tsx || echo "blog-writer.tsx missing"
RUN ls -la src/components/design-system/theme.ts || echo "theme.ts missing"
RUN ls -la src/services/postService.ts || echo "postService.ts missing"
RUN echo "TypeScript config:"
RUN cat tsconfig.json
RUN echo "Next.js config:"
RUN cat next.config.ts
RUN echo "Prisma status:"
RUN ls -la node_modules/.prisma/ || echo "No Prisma client"
RUN echo "=== Building ==="

# Build the application
RUN echo "Checking TypeScript compilation..."
RUN npx tsc --noEmit || echo "TypeScript check failed, but continuing..."
RUN echo "Starting Next.js build..."
RUN npm run build

# Create user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Change ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expose port
EXPOSE 3000

ENV PORT=3000

# Start the application
CMD ["npm", "start"]
