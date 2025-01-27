import Image from 'next/image'
import Link from 'next/link'
import { BlogPost } from '@/src/types'

const posts: BlogPost[] = [
  {
    id: 1,
    title: 'A guide to AI prototyping for product managers',
    subtitle: 'How to turn your idea into a working prototype in minutes',
    date: 'JAN 7',
    author: {
      name: 'Colin Matthews',
      image: '/images/blog/authors/colin-matthews.jpg'
    },
    image: '/images/blog/posts/ai-prototyping/cover.jpg'
  },
  // ... 추가 포스트
]

export default function BlogList() {
  return (
    <div className="blog-list">
      {posts.map((post) => (
        <article key={post.id} className="blog-item">
          <div className="blog-content">
            <div className="blog-meta">
              <time>{post.date}</time>
              <span className="author">{post.author.name}</span>
            </div>
            <Link href={`/blog/${post.id}`}>
              <h2>{post.title}</h2>
              <p>{post.subtitle}</p>
            </Link>
          </div>
          <div className="blog-image">
            <Image
              src={post.image}
              alt={post.title}
              width={400}
              height={300}
              quality={90}
            />
          </div>
        </article>
      ))}
    </div>
  )
} 