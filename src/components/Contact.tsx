export default function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Contact</span>
          <h2>프로젝트 문의</h2>
        </div>
        <div className="contact-content">
          <div className="contact-info">
            <div className="info-item kakao-item">
              <i className="fas fa-comment" />
              <a 
                href="https://pf.kakao.com/_Lpaln/chat" 
                target="_blank"
                rel="noopener noreferrer"
                className="kakao-button"
              >
                카카오톡 채널 상담하기
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 