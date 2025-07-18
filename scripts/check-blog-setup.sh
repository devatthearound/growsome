#!/bin/bash

echo "🔍 Checking Prisma setup and database tables..."

# 1. Check if Prisma client is generated
echo "📦 Checking Prisma client generation..."
if [ -d "src/generated/prisma-blog" ]; then
  echo "✅ Prisma blog client exists"
else
  echo "❌ Prisma blog client not found, generating..."
  npm run blog:generate
fi

# 2. Check database connection
echo "🔗 Testing database connection..."
npx prisma db pull --schema=./prisma/schema-blog.prisma --print

# 3. Show current schema status
echo "📋 Checking migration status..."
npm run blog:status

echo "🎯 If tables don't exist, run: npm run blog:reset -- --force && npm run blog:migrate"
echo "🌱 Then run: npm run blog:seed"
