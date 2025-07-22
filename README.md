# 🌱 Growsome - AI-Powered Content Platform

A Next.js-based content platform with AI automation, advanced analytics, and comprehensive blog management system.

## 🚀 Features

### Core Platform
- **Next.js 14** with App Router
- **PostgreSQL** database with **Prisma ORM**  
- **GraphQL API** with Apollo Server
- **JWT Authentication** with role-based access
- **AWS S3** for file storage
- **Styled Components** for styling

### AI Automation System 🤖
- **GPT-powered blog summarization**
- **n8n workflow automation**
- **Auto-publishing to blog**
- **Smart content categorization**

### Advanced Analytics 📊
- **GA4 Enhanced Tracking** - User behavior, scroll depth, performance metrics
- **Microsoft Clarity** integration
- **Custom event tracking** for all user interactions
- **Real-time analytics dashboard**

### Blog Management 📝
- **Rich text editor** with TipTap
- **Category and tag management**
- **SEO optimization**
- **Comment system**
- **Like/Share functionality**

## 🏁 Getting Started

### Prerequisites
```bash
Node.js 18+
PostgreSQL 14+
npm or yarn
```

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd growsome

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and API keys

# Set up database
npm run db:generate
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🤖 AI Blog Automation

### Quick Test
```bash
# Test the complete automation pipeline
npm run test:blog-automation

# Or use the quick test script
chmod +x quick-test.sh
./quick-test.sh
```

### Setup AI Automation
1. **Configure n8n workflow** (see `docs/AI_BLOG_AUTOMATION_GUIDE.md`)
2. **Set OpenAI API key** in n8n credentials
3. **Get JWT token** for API access:
   ```bash
   curl -X POST https://growsome.kr/api/auth/generate-token \
     -H "Content-Type: application/json" \
     -d '{"apiKey": "your-api-key", "purpose": "blog_automation"}'
   ```

### Automation Features
- ✅ **RSS feed monitoring** - Auto-detect new content
- ✅ **GPT summarization** - Convert to Korean blog posts  
- ✅ **Auto-publishing** - Direct to Growsome blog
- ✅ **GA4 tracking** - Monitor automation performance
- ✅ **Error handling** - Retry logic and notifications

## 📊 Analytics & Tracking

### GA4 Enhanced Features
```javascript
import { useEnhancedGA4 } from '../hooks/useEnhancedGA4';

// Track custom events
const { trackButtonClick, trackFormSubmit } = useEnhancedGA4();

// Use in components
<button onClick={() => trackButtonClick('subscribe', 'header')}>
  Subscribe
</button>
```

### Available Tracking
- **Page views** with user properties
- **Scroll depth** (25%, 50%, 75%, 100%)
- **Form interactions** (start, submit, errors)
- **Content engagement** (shares, likes, comments)
- **E-commerce events** (purchases, cart actions)
- **Performance metrics** (Core Web Vitals)
- **Error tracking** (JS errors, network failures)

## 🗄️ Database Schema

### Blog Tables
- `blog_contents` - Blog posts and articles
- `blog_categories` - Content categories
- `blog_tags` - Tagging system
- `blog_comments` - Comment threads
- `blog_likes` - User engagement

### User Management  
- `user` - User accounts and profiles
- `user_sessions` - Session management

## 📚 API Endpoints

### GraphQL API
```graphql
# Main endpoint
POST /api/graphql

# Example queries
query {
  contents(first: 10) {
    id title slug contentBody
    author { username }
    category { name }
  }
}

# Create content
mutation {
  createContent(input: {
    title: "New Post"
    contentBody: "Content here..."
    authorId: 1
  }) {
    id slug title
  }
}
```

### REST Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/generate-token` - API token generation
- `GET /api/health` - Health check

## 🛠️ Development Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database  
npm run db:migrate      # Create migration
npm run db:seed         # Seed with sample data
npm run db:studio       # Open Prisma Studio

# Testing & Automation
npm run test:blog-automation    # Test AI automation
npm run blog:auto-upload        # Same as above
./quick-test.sh                 # Quick system check

# Linting
npm run lint            # ESLint check
```

## 🔧 Configuration

### Environment Variables
```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication  
JWT_SECRET="your-secret-key"

# File Storage
AWS_S3_BUCKET="your-bucket"
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"

# Analytics
NEXT_PUBLIC_GA4_MEASUREMENT_ID="G-XXXXXXXXX"

# AI Automation
N8N_API_KEY="your-n8n-key"
OPENAI_API_KEY="sk-your-openai-key"
```

### Key Configuration Files
- `next.config.js` - Next.js configuration
- `prisma/schema.prisma` - Database schema
- `tailwind.config.ts` - Styling configuration
- `.env` - Environment variables

## 📖 Documentation

- [`docs/GA4_TRACKING_GUIDE.md`](docs/GA4_TRACKING_GUIDE.md) - Complete analytics setup
- [`docs/AI_BLOG_AUTOMATION_GUIDE.md`](docs/AI_BLOG_AUTOMATION_GUIDE.md) - AI automation setup
- [`test-blog-automation.js`](test-blog-automation.js) - Automation test script

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Setup
1. Set production environment variables
2. Configure database connection
3. Set up AWS S3 bucket
4. Configure GA4 tracking
5. Set up n8n automation server

### Health Checks
- `GET /api/health` - API health
- `./quick-test.sh` - Full system test
- GA4 Real-time reports - User activity

## 🔍 Monitoring & Debugging

### Logs
- Server logs: Console output
- GA4 events: Real-time dashboard  
- Database queries: Prisma logging
- Errors: Automatic GA4 error tracking

### Debug Tools
- Prisma Studio: Database GUI
- GA4 DebugView: Event validation
- Browser DevTools: Frontend debugging

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Issues**: GitHub Issues
- **Documentation**: `/docs` folder  
- **API Reference**: GraphQL Playground at `/api/graphql`
- **Analytics**: GA4 Dashboard

---

**Made with ❤️ for content creators and AI enthusiasts**
