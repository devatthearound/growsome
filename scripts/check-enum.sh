#!/bin/bash

echo "🔍 Checking database schema and enum types..."

# Check if ContentStatus enum exists
echo "📋 Checking enum types in database..."
npx prisma db execute --schema=./prisma/schema-blog.prisma --stdin <<EOF
SELECT 
    t.typname AS enum_name,
    e.enumlabel AS enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname = 'ContentStatus'
ORDER BY e.enumsortorder;
EOF

echo ""
echo "📊 Checking table structure for blog_contents..."
npx prisma db execute --schema=./prisma/schema-blog.prisma --stdin <<EOF
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'blog_contents' 
ORDER BY ordinal_position;
EOF

echo ""
echo "🔧 If enum doesn't exist, creating it manually..."
npx prisma db execute --schema=./prisma/schema-blog.prisma --stdin <<EOF
DO \$\$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ContentStatus') THEN
        CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'PRIVATE');
    END IF;
END
\$\$;
EOF

echo "✅ Enum creation attempted. Now run: npm run blog:seed"
