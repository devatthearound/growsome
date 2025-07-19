# Simple Next.js build without standalone mode
FROM node:18-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat openssl

# Copy package files
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Debug: Check if .env.production exists and its contents
RUN echo "=== Environment Debug ==="
RUN ls -la .env* || echo "No .env files found"
RUN if [ -f .env.production ]; then echo ".env.production exists"; cat .env.production | head -5; else echo ".env.production not found"; fi
RUN echo "DATABASE_URL from env: $DATABASE_URL"

# Generate Prisma client
RUN npx prisma generate

# Create environment file
RUN touch .env.production

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build the application
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
