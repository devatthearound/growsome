import Image from 'next/image'

const videos = [
  {
    id: 1,
    title: 'GPT-4로 개인화된 콜드 이메일 작성하기',
    views: '2.1만회',
    date: '1주 전',
    thumbnail: '/images/youtube/cold-email.jpg'
  },
  {
    id: 2,
    title: 'AI로 랜딩 페이지 최적화하기',
    views: '1.5만회',
    date: '2주 전',
    thumbnail: '/images/youtube/landing-page.jpg'
  },
  {
    id: 3,
    title: '자동으로 유튜브 챕터 생성하기',
    views: '1.8만회',
    date: '3주 전',
    thumbnail: '/images/youtube/youtube-chapters.jpg'
  }
]

export default function Youtube() {
  return (
    <section id="youtube" className="youtube-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">YouTube</span>
          <h2>AI 활용 가이드</h2>
          <p className="section-desc">실용적인 AI 활용 팁과 노하우를 공유합니다</p>
        </div>
        <div className="youtube-grid">
          {videos.map((video) => (
            <div key={video.id} className="youtube-card">
              <div className="youtube-thumbnail">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  width={600}
                  height={340}
                  quality={90}
                />
                <div className="play-button">
                  <i className="fab fa-youtube" />
                </div>
              </div>
              <div className="youtube-content">
                <h3>{video.title}</h3>
                <div className="video-meta">
                  <span className="views">조회수 {video.views}</span>
                  <span className="date">{video.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="youtube-cta">
          <a 
            href="https://youtube.com/@channel" 
            target="_blank"
            rel="noopener noreferrer" 
            className="view-all-btn"
          >
            유튜브 채널 방문하기 <i className="fas fa-arrow-right" />
          </a>
        </div>
      </div>
    </section>
  )
} 