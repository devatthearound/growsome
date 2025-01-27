import Image from 'next/image'

const works = [
  {
    id: 1,
    title: 'Greenspacing',
    location: 'Copenhagen',
    year: '2022',
    image: '/images/works/greenspacing.jpg'
  },
  {
    id: 2,
    title: 'The Float House',
    location: 'Los Angeles',
    year: '2023',
    image: '/images/works/float-house.jpg'
  },
  // ... 추가 작업들
]

export default function Works() {
  return (
    <section id="works" className="works-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Projects</span>
          <h2>주요 프로젝트</h2>
        </div>
        <div className="works-grid">
          {works.map((work) => (
            <div key={work.id} className="work-card">
              <Image
                src={work.image}
                alt={work.title}
                width={800}
                height={500}
                quality={90}
              />
              <div className="work-info">
                <h3>{work.title}</h3>
                <p>{work.location}, {work.year}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="work-navigation">
          <button className="work-nav-btn prev-btn">
            <i className="fas fa-arrow-left" />
          </button>
          <button className="work-nav-btn next-btn">
            <i className="fas fa-arrow-right" />
          </button>
        </div>
      </div>
    </section>
  )
} 