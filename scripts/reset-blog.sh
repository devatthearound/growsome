#!/bin/bash

echo "🔄 Resetting and rebuilding Growsome Blog System"
echo "=============================================="

# 1. Reset database
echo "🗄️  Resetting database..."
npm run blog:reset --force

# 2. Generate Prisma client
echo "🔧 Generating Prisma blog client..."
npm run blog:generate

# 3. Run migrations
echo "📋 Running migrations..."
npm run blog:migrate

# 4. Seed data
echo "🌱 Seeding blog data..."
npm run blog:seed

echo "✅ Blog system reset and setup complete!"
echo ""
echo "Your blog is ready at:"
echo "  📝 Blog List: http://localhost:3000/blog"
echo "  ✍️  Write Post: http://localhost:3000/blog/write"
echo "  🔧 GraphQL Playground: http://localhost:3000/api/graphql"
