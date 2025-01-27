export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">Growsome</div>
          <p className="footer-description">
            AI로 똑똑하게, 창의적으로 우리는 문제를 해결합니다. 
            최신 AI 기술과 창의적인 솔루션으로 비즈니스의 혁신을 이끕니다.
          </p>
          <div className="footer-social">
            <a href="#"><i className="fab fa-linkedin" /></a>
            <a href="#"><i className="fab fa-instagram" /></a>
            <a href="#"><i className="fab fa-github" /></a>
            <a href="#"><i className="fab fa-youtube" /></a>
          </div>
        </div>
        {/* ... 나머지 푸터 내용 ... */}
      </div>
    </footer>
  )
} 