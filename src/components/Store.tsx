import Image from 'next/image'

const storeItems = [
  {
    id: 1,
    title: '미래도시 컨셉 아트',
    tags: ['Midjourney', '도시', 'SF'],
    price: 30000,
    image: '/images/store/future-city.jpg'
  },
  // ... 추가 상품들
]

export default function Store() {
  return (
    <section id="store" className="store-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">AI Store</span>
          <h2>바로 사용하는 AI 에셋</h2>
          <p className="section-desc">
            Midjourney, Stable Diffusion으로 제작된 고품질 이미지
          </p>
        </div>
        <div className="store-grid">
          {storeItems.map((item) => (
            <div key={item.id} className="store-card">
              <div className="store-image">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={400}
                  quality={90}
                />
              </div>
              <div className="store-info">
                <h3>{item.title}</h3>
                <div className="tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="store-footer">
                <span className="price">₩{item.price.toLocaleString()}</span>
                <button className="buy-btn">구매하기</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 