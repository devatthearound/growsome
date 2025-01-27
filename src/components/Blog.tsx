import Image from 'next/image'
import Link from 'next/link'

const posts = [
  {
    id: 1,
    date: 'JAN 21',
    title: "What's in your stack: The state of tech tools in 2025",
    description: "The products people love, hate, and can't live without in 2025",
    author: {
      name: 'NOAM SEGAL',
      avatar: '/images/blog/authors/noam-segal.jpg'
    }
  },
  // ... 추가 포스트
]

export default function Blog() {
  return (
    <section id="blog" className="blog-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Blog</span>
          <h2>AI 인사이트</h2>
          <p className="section-desc">최신 AI 기술과 산업 동향을 공유합니다</p>
        </div>
        <div className="blog-grid">
          {posts.map((post) => (
            <article key={post.id} className="blog-card">
              <div className="blog-image">
                <Image
                  src={`/images/blog/${post.id}.jpg`}
                  alt={post.title}
                  width={400}
                  height={250}
                  quality={90}
                />
              </div>
              <div className="blog-content">
                <time>{post.date}</time>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                <div className="blog-meta">
                  <div className="author">
                    <div className="author-avatar">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={50}
                        height={50}
                      />
                    </div>
                    <span className="author-name">{post.author.name}</span>
                  </div>
                  <Link href={`/blog/${post.id}`} className="read-more">
                    Read more <i className="fas fa-arrow-right" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="blog-cta">
          <Link href="/blog" className="view-all-btn">
            전체 글 보기 <i className="fas fa-arrow-right" />
          </Link>
        </div>
      </div>
    </section>
  )
} 