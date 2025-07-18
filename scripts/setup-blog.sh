#!/bin/bash

echo "🚀 Setting up Growsome Blog System"
echo "=================================="

# 1. Install dependencies if needed
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
else
  echo "Dependencies already installed ✅"
fi

# 2. Generate Prisma client for blog
echo "🔧 Generating Prisma blog client..."
npm run blog:generate

# 3. Check database connection
echo "🔗 Checking database connection..."
if npm run db:status > /dev/null 2>&1; then
  echo "Database connection OK ✅"
else
  echo "⚠️  Database connection failed. Please check your BLOG_DATABASE_URL"
fi

# 4. Run database migrations
echo "🗄️  Running database migrations..."
npm run blog:migrate

# 5. Seed the database
echo "🌱 Seeding blog data..."
npm run blog:seed

# 6. Start development server
echo "🎉 Setup complete! Starting development server..."
echo ""
echo "Your blog is ready at:"
echo "  📝 Blog List: http://localhost:3000/blog"
echo "  ✍️  Write Post: http://localhost:3000/blog/write"
echo "  🔧 GraphQL Playground: http://localhost:3000/api/graphql"
echo ""

read -p "Start development server now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  npm run dev
fi
