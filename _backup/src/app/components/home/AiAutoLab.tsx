import styled from 'styled-components';

const AiAutoLab = () => {
  return (
    <LabContainer>
      <LabHeader>
        <h2>AI 자동화 연구소</h2>
        <h3>쿠팡파트너스를 시작으로 제휴 마케팅 & 마케팅 성과 자동화!</h3>
      </LabHeader>

      <IntroSection>
        <Question>"제휴 마케팅을 자동화하면? 마케팅 성과를 극대화하면?"</Question>
        <Answer>
          우리가 먼저 만들어보았습니다.
          <br />
          당신의 비즈니스 성장을 극대화할 AI 프로젝트를 만나보세요.
        </Answer>
      </IntroSection>

      <CollaborationSection>
        <h3>🚀 함께 만드는 AI 자동화 연구소</h3>
        
        <FilterOptions>
          <span>🔍 필터 옵션:</span>
          <FilterButton>최신순</FilterButton>
          <FilterButton>인기순</FilterButton>
          <FilterButton>수익화</FilterButton>
        </FilterOptions>

        <ProjectGrid>
          <ProjectCard>
            <h4>🔹 AffiliSmart</h4>
            <p>클릭 한 번으로 매력적인 상품 홍보 영상을 자동 생성! AI가 당신의 마케팅을 더 스마트하게 만들어줍니다.</p>
            <ProjectStats>
              <span>📌 참여자: 0명</span>
              <span>📌 User Reviews: ⭐⭐⭐⭐⭐</span>
            </ProjectStats>
          </ProjectCard>

          <ProjectCard>
            <h4>🔹 제휴 마케팅 자동화</h4>
            <p>쿠팡파트너스 및 다양한 플랫폼을 연계하여 자동화된 수익화를 경험하세요.</p>
            <ProjectStats>
              <span>📌 참여자: 0명</span>
              <span>📌 User Reviews: ⭐⭐⭐⭐⭐</span>
            </ProjectStats>
          </ProjectCard>

          <ProjectCard>
            <h4>🔹 마케팅 성과 자동화</h4>
            <p>AI 기반으로 광고 성과를 분석하고, 최적의 캠페인을 추천받으세요.</p>
            <ProjectStats>
              <span>📌 참여자: 0명</span>
              <span>📌 User Reviews: ⭐⭐⭐⭐⭐</span>
            </ProjectStats>
          </ProjectCard>

          <ProjectCard className="coming-soon">
            <h4>🔹 More Projects Coming Soon!</h4>
          </ProjectCard>
        </ProjectGrid>
      </CollaborationSection>
    </LabContainer>
  );
};

const LabContainer = styled.section`
  padding: 60px 20px;
  background: #f8f9fa;
`;

const LabHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;

  h2 {
    font-size: 2.5rem;
    margin-bottom: 15px;
    color: #514FE4;
  }

  h3 {
    font-size: 1.5rem;
    color: #333;
  }
`;

const IntroSection = styled.div`
  text-align: center;
  margin-bottom: 50px;
`;

const Question = styled.p`
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #514FE4;
`;

const Answer = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
`;

const CollaborationSection = styled.div`
  h3 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 1.8rem;
  }
`;

const FilterOptions = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  
  span {
    font-weight: bold;
  }
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #514FE4;
  border-radius: 20px;
  background: white;
  color: #514FE4;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #514FE4;
    color: white;
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const ProjectCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h4 {
    font-size: 1.2rem;
    margin-bottom: 15px;
    color: #514FE4;
  }

  p {
    margin-bottom: 20px;
    line-height: 1.5;
  }

  &.coming-soon {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f0f0;
    color: #666;
  }
`;

const ProjectStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 0.9rem;
  color: #666;
`;

export default AiAutoLab;
