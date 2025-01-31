import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faHistory, faPlus, faPencilAlt, faDownload, 
  faShoppingBag, faGraduationCap, faGift, faCreditCard, faTicket, faArrowLeft, faCog 
} from '@fortawesome/free-solid-svg-icons';
import { useCoupangApi } from '../contexts/CoupangApiContext';

const MyPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('menu');
  const { apiKeys, updateApiKeys } = useCoupangApi();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editableKeys, setEditableKeys] = useState(apiKeys);

  const handleSave = () => {
    setIsSaving(true);
    try {
      updateApiKeys(editableKeys);
      setIsEditing(false);
      setMessage('API 키가 저장되었습니다.');
    } catch (error) {
      setMessage('API 키 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // 임시 데이터 - 실제로는 API에서 가져올 것
  const userInfo = {
    name: '홍길동',
    email: 'hong@example.com',
    phone: '010-1234-5678',
    company: '그로썸',
    position: 'CEO'
  };

  const projectHistory = [
    {
      id: 1,
      type: '개발구독',
      title: 'AI 챗봇 개발',
      status: '진행중',
      date: '2024-03-15',
      details: '월 40시간 구독'
    },
    {
      id: 2,
      type: '개발문의',
      title: '부동산 플랫폼 개발',
      status: '완료',
      date: '2024-02-20',
      details: '기획 및 개발 완료'
    }
  ];

  // 구매 내역 데이터 추가
  const purchaseHistory = [
    {
      id: 1,
      type: '에셋',
      title: '자연스러운 풍경 컬렉션',
      date: '2024-03-10',
      price: '25,000원',
      downloadUrl: '/downloads/assets/landscape-collection.zip',
      thumbnail: '/images/store/product1.jpg'
    },
    {
      id: 2,
      type: '템플릿',
      title: '미니멀 로고 디자인',
      date: '2024-03-05',
      price: '35,000원',
      downloadUrl: '/downloads/assets/minimal-logo.zip',
      thumbnail: '/images/store/product2.jpg'
    }
  ];

  // 수강 중인 강의 데이터
  const courseHistory = [
    {
      id: 1,
      title: 'AI 기초 마스터 과정',
      progress: 65,
      lastAccess: '2024-03-15',
      thumbnail: '/images/courses/ai-basic.jpg',
      nextLesson: '5. AI 모델 학습하기'
    },
    {
      id: 2,
      title: '머신러닝 실전 프로젝트',
      progress: 30,
      lastAccess: '2024-03-14',
      thumbnail: '/images/courses/ml-project.jpg',
      nextLesson: '3. 데이터 전처리'
    }
  ];

  // 참여 가능한 이벤트 데이터
  const availableEvents = [
    {
      id: 1,
      title: '봄맞이 AI 강의 할인',
      period: '2024.03.20 - 2024.04.10',
      discount: '30%',
      thumbnail: '/images/events/spring-sale.jpg',
      status: '진행중'
    },
    {
      id: 2,
      title: '신규 회원 특별 혜택',
      period: '2024.03.01 - 2024.03.31',
      benefit: '첫 구매 50% 할인',
      thumbnail: '/images/events/new-member.jpg',
      status: '마감임박'
    }
  ];

  // 결제 이력 데이터
  const paymentHistory = [
    {
      id: 1,
      date: '2024-03-15',
      item: 'AI 기초 마스터 과정',
      amount: '99,000원',
      method: '카카오페이',
      status: '결제완료'
    },
    {
      id: 2,
      date: '2024-03-10',
      item: '자연스러운 풍경 컬렉션',
      amount: '25,000원',
      method: '신용카드',
      status: '결제완료'
    }
  ];

  // 보유 쿠폰 데이터
  const coupons = [
    {
      id: 1,
      name: '신규가입 환영 쿠폰',
      discount: '10,000원',
      minPurchase: '50,000원 이상',
      expiry: '2024-04-30',
      status: '사용가능'
    },
    {
      id: 2,
      name: '봄맞이 특별 할인',
      discount: '30%',
      minPurchase: '100,000원 이상',
      expiry: '2024-04-10',
      status: '사용가능'
    }
  ];

  const handleNewInquiry = () => {
    navigate('/inquiry');
  };

  const handleDownload = (downloadUrl) => {
    // 실제 구현에서는 인증 토큰을 확인하고 다운로드 처리
    window.open(downloadUrl, '_blank');
  };

  // 각 탭의 내용을 렌더링하는 함수
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <Section>
            <SectionHeader>
              <h2>회원정보</h2>
              <EditButton>
                <FontAwesomeIcon icon={faPencilAlt} />
                수정
              </EditButton>
            </SectionHeader>
            <ProfileGrid>
              <ProfileItem>
                <Label>이름</Label>
                <Value>{userInfo.name}</Value>
              </ProfileItem>
              <ProfileItem>
                <Label>이메일</Label>
                <Value>{userInfo.email}</Value>
              </ProfileItem>
              <ProfileItem>
                <Label>연락처</Label>
                <Value>{userInfo.phone}</Value>
              </ProfileItem>
              <ProfileItem>
                <Label>회사</Label>
                <Value>{userInfo.company}</Value>
              </ProfileItem>
              <ProfileItem>
                <Label>직책</Label>
                <Value>{userInfo.position}</Value>
              </ProfileItem>
            </ProfileGrid>
          </Section>
        );

      case 'history':
        return (
          <Section>
            <SectionHeader>
              <h2>프로젝트 히스토리</h2>
              <NewInquiryButton onClick={handleNewInquiry}>
                <FontAwesomeIcon icon={faPlus} />
                새 프로젝트 문의
              </NewInquiryButton>
            </SectionHeader>
            <ProjectList>
              {projectHistory.map(project => (
                <ProjectCard key={project.id}>
                  <ProjectHeader>
                    <ProjectType>{project.type}</ProjectType>
                    <ProjectStatus status={project.status}>{project.status}</ProjectStatus>
                  </ProjectHeader>
                  <ProjectTitle>{project.title}</ProjectTitle>
                  <ProjectDetails>
                    <span>{project.date}</span>
                    <span>{project.details}</span>
                  </ProjectDetails>
                </ProjectCard>
              ))}
            </ProjectList>
          </Section>
        );

      case 'purchases':
        return (
          <Section>
            <SectionHeader>
              <h2>구매내역</h2>
            </SectionHeader>
            <PurchaseList>
              {purchaseHistory.map(purchase => (
                <PurchaseCard key={purchase.id}>
                  <PurchaseImageWrapper>
                    <PurchaseImage src={purchase.thumbnail} alt={purchase.title} />
                  </PurchaseImageWrapper>
                  <PurchaseInfo>
                    <PurchaseHeader>
                      <PurchaseType>{purchase.type}</PurchaseType>
                      <PurchaseDate>{purchase.date}</PurchaseDate>
                    </PurchaseHeader>
                    <PurchaseTitle>{purchase.title}</PurchaseTitle>
                    <PurchasePrice>{purchase.price}</PurchasePrice>
                    <DownloadButton onClick={() => handleDownload(purchase.downloadUrl)}>
                      <FontAwesomeIcon icon={faDownload} />
                      다운로드
                    </DownloadButton>
                  </PurchaseInfo>
                </PurchaseCard>
              ))}
            </PurchaseList>
          </Section>
        );

      case 'courses':
        return (
          <Section>
            <SectionHeader>
              <h2>수강중인 강의</h2>
            </SectionHeader>
            <CourseList>
              {courseHistory.map(course => (
                <CourseCard key={course.id}>
                  <CourseImage src={course.thumbnail} alt={course.title} />
                  <CourseInfo>
                    <CourseTitle>{course.title}</CourseTitle>
                    <CourseProgress>
                      <ProgressBar progress={course.progress} />
                      <ProgressText>{course.progress}% 완료</ProgressText>
                    </CourseProgress>
                    <CourseDetails>
                      <span>최근 수강: {course.lastAccess}</span>
                      <span>다음 강의: {course.nextLesson}</span>
                    </CourseDetails>
                    <ContinueButton>이어서 학습하기</ContinueButton>
                  </CourseInfo>
                </CourseCard>
              ))}
            </CourseList>
          </Section>
        );

      case 'events':
        return (
          <Section>
            <SectionHeader>
              <h2>이벤트</h2>
            </SectionHeader>
            <EventList>
              {availableEvents.map(event => (
                <EventCard key={event.id}>
                  <EventImage src={event.thumbnail} alt={event.title} />
                  <EventInfo>
                    <EventStatus status={event.status}>{event.status}</EventStatus>
                    <EventTitle>{event.title}</EventTitle>
                    <EventPeriod>{event.period}</EventPeriod>
                    <EventBenefit>
                      {event.discount || event.benefit}
                    </EventBenefit>
                    <ParticipateButton>참여하기</ParticipateButton>
                  </EventInfo>
                </EventCard>
              ))}
            </EventList>
          </Section>
        );

      case 'payments':
        return (
          <Section>
            <SectionHeader>
              <h2>결제이력</h2>
            </SectionHeader>
            <PaymentTable>
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>상품</th>
                  <th>금액</th>
                  <th>결제수단</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map(payment => (
                  <tr key={payment.id}>
                    <td>{payment.date}</td>
                    <td>{payment.item}</td>
                    <td>{payment.amount}</td>
                    <td>{payment.method}</td>
                    <td>
                      <PaymentStatus>{payment.status}</PaymentStatus>
                    </td>
                  </tr>
                ))}
              </tbody>
            </PaymentTable>
          </Section>
        );

      case 'coupons':
        return (
          <Section>
            <SectionHeader>
              <h2>쿠폰관리</h2>
            </SectionHeader>
            <CouponList>
              {coupons.map(coupon => (
                <CouponCard key={coupon.id}>
                  <CouponDiscount>{coupon.discount}</CouponDiscount>
                  <CouponInfo>
                    <CouponName>{coupon.name}</CouponName>
                    <CouponDetails>
                      <span>{coupon.minPurchase}</span>
                      <span>~{coupon.expiry}</span>
                    </CouponDetails>
                  </CouponInfo>
                  <CouponStatus>{coupon.status}</CouponStatus>
                </CouponCard>
              ))}
            </CouponList>
          </Section>
        );

      case 'apiSettings':
        return (
          <Section>
            <SectionHeader>
              <h2>쿠팡 파트너스 API 설정</h2>
            </SectionHeader>
            {!isEditing ? (
              <ViewMode>
                <ProfileGrid>
                  <ProfileItem>
                    <Label>Access Key</Label>
                    <Value>{apiKeys.accessKey ? '********' : '미설정'}</Value>
                  </ProfileItem>
                  <ProfileItem>
                    <Label>Secret Key</Label>
                    <Value>{apiKeys.secretKey ? '********' : '미설정'}</Value>
                  </ProfileItem>
                  <ProfileItem>
                    <Label>Sub ID</Label>
                    <Value>{apiKeys.subId || '미설정'}</Value>
                  </ProfileItem>
                </ProfileGrid>
                <EditButton onClick={() => setIsEditing(true)}>
                  <FontAwesomeIcon icon={faPencilAlt} />
                  수정
                </EditButton>
              </ViewMode>
            ) : (
              <EditMode>
                <InputGroup>
                  <Label>Access Key</Label>
                  <Input
                    type="text"
                    value={editableKeys.accessKey}
                    onChange={(e) => setEditableKeys({...editableKeys, accessKey: e.target.value})}
                    placeholder="쿠팡 파트너스 Access Key 입력"
                  />
                </InputGroup>
                <InputGroup>
                  <Label>Secret Key</Label>
                  <Input
                    type="password"
                    value={editableKeys.secretKey}
                    onChange={(e) => setEditableKeys({...editableKeys, secretKey: e.target.value})}
                    placeholder="쿠팡 파트너스 Secret Key 입력"
                  />
                </InputGroup>
                <InputGroup>
                  <Label>Sub ID</Label>
                  <Input
                    type="text"
                    value={editableKeys.subId}
                    onChange={(e) => setEditableKeys({...editableKeys, subId: e.target.value})}
                    placeholder="쿠팡 파트너스 Sub ID 입력"
                  />
                </InputGroup>
                <ButtonGroup>
                  <SaveButton onClick={handleSave} disabled={isSaving}>
                    {isSaving ? '저장 중...' : '저장'}
                  </SaveButton>
                  <CancelButton onClick={() => setIsEditing(false)}>
                    취소
                  </CancelButton>
                </ButtonGroup>
                {message && <Message error={false}>{message}</Message>}
                <HelpText>
                  * 쿠팡 파트너스 API 키는 안전하게 암호화되어 저장됩니다.
                  <br />
                  * API 키 발급 방법은 <Link href="https://partners.coupang.com/" target="_blank">쿠팡 파트너스</Link>에서 확인하실 수 있습니다.
                </HelpText>
              </EditMode>
            )}
          </Section>
        );

      default:
        return <div>선택된 탭이 없습니다.</div>;
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <h1>마이페이지</h1>
      </PageHeader>

      {/* PC 버전 */}
      <DesktopLayout>
        <Sidebar>
          <TabButton 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')}
          >
            <FontAwesomeIcon icon={faUser} />
            회원정보
          </TabButton>
          <TabButton 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')}
          >
            <FontAwesomeIcon icon={faHistory} />
            프로젝트 히스토리
          </TabButton>
          <TabButton 
            active={activeTab === 'purchases'} 
            onClick={() => setActiveTab('purchases')}
          >
            <FontAwesomeIcon icon={faShoppingBag} />
            구매내역
          </TabButton>
          <TabButton 
            active={activeTab === 'courses'} 
            onClick={() => setActiveTab('courses')}
          >
            <FontAwesomeIcon icon={faGraduationCap} />
            수강중인 강의
          </TabButton>
          <TabButton 
            active={activeTab === 'events'} 
            onClick={() => setActiveTab('events')}
          >
            <FontAwesomeIcon icon={faGift} />
            이벤트
          </TabButton>
          <TabButton 
            active={activeTab === 'payments'} 
            onClick={() => setActiveTab('payments')}
          >
            <FontAwesomeIcon icon={faCreditCard} />
            결제이력
          </TabButton>
          <TabButton 
            active={activeTab === 'coupons'} 
            onClick={() => setActiveTab('coupons')}
          >
            <FontAwesomeIcon icon={faTicket} />
            쿠폰관리
          </TabButton>
          <TabButton 
            active={activeTab === 'apiSettings'} 
            onClick={() => setActiveTab('apiSettings')}
          >
            <FontAwesomeIcon icon={faCog} />
            API 설정
          </TabButton>
        </Sidebar>
        <MainContent>
          {renderTabContent()}
        </MainContent>
      </DesktopLayout>

      {/* 모바일 버전 */}
      <MobileLayout>
        {!activeTab || activeTab === 'menu' ? (
          <MobileMenuList>
            <MenuItem onClick={() => setActiveTab('profile')}>
              <MenuIcon>
                <FontAwesomeIcon icon={faUser} />
              </MenuIcon>
              <MenuContent>
                <MenuTitle>회원정보</MenuTitle>
                <MenuDescription>회원정보 확인 및 수정</MenuDescription>
              </MenuContent>
              <MenuArrow>›</MenuArrow>
            </MenuItem>
            <MenuItem onClick={() => setActiveTab('history')}>
              <MenuIcon>
                <FontAwesomeIcon icon={faHistory} />
              </MenuIcon>
              <MenuContent>
                <MenuTitle>프로젝트 히스토리</MenuTitle>
                <MenuDescription>진행중인 프로젝트 및 히스토리</MenuDescription>
              </MenuContent>
              <MenuArrow>›</MenuArrow>
            </MenuItem>
            <MenuItem onClick={() => setActiveTab('purchases')}>
              <MenuIcon>
                <FontAwesomeIcon icon={faShoppingBag} />
              </MenuIcon>
              <MenuContent>
                <MenuTitle>구매내역</MenuTitle>
                <MenuDescription>상품 구매내역 및 다운로드</MenuDescription>
              </MenuContent>
              <MenuArrow>›</MenuArrow>
            </MenuItem>
            <MenuItem onClick={() => setActiveTab('courses')}>
              <MenuIcon>
                <FontAwesomeIcon icon={faGraduationCap} />
              </MenuIcon>
              <MenuContent>
                <MenuTitle>수강중인 강의</MenuTitle>
                <MenuDescription>학습 진행 현황</MenuDescription>
              </MenuContent>
              <MenuArrow>›</MenuArrow>
            </MenuItem>
            <MenuItem onClick={() => setActiveTab('events')}>
              <MenuIcon>
                <FontAwesomeIcon icon={faGift} />
              </MenuIcon>
              <MenuContent>
                <MenuTitle>이벤트</MenuTitle>
                <MenuDescription>참여 가능한 이벤트</MenuDescription>
              </MenuContent>
              <MenuArrow>›</MenuArrow>
            </MenuItem>
            <MenuItem onClick={() => setActiveTab('payments')}>
              <MenuIcon>
                <FontAwesomeIcon icon={faCreditCard} />
              </MenuIcon>
              <MenuContent>
                <MenuTitle>결제이력</MenuTitle>
                <MenuDescription>결제 내역 확인</MenuDescription>
              </MenuContent>
              <MenuArrow>›</MenuArrow>
            </MenuItem>
            <MenuItem onClick={() => setActiveTab('coupons')}>
              <MenuIcon>
                <FontAwesomeIcon icon={faTicket} />
              </MenuIcon>
              <MenuContent>
                <MenuTitle>쿠폰관리</MenuTitle>
                <MenuDescription>보유 쿠폰 확인</MenuDescription>
              </MenuContent>
              <MenuArrow>›</MenuArrow>
            </MenuItem>
            <MenuItem onClick={() => setActiveTab('apiSettings')}>
              <MenuIcon>
                <FontAwesomeIcon icon={faCog} />
              </MenuIcon>
              <MenuContent>
                <MenuTitle>API 설정</MenuTitle>
                <MenuDescription>쿠팡 파트너스 API 설정</MenuDescription>
              </MenuContent>
              <MenuArrow>›</MenuArrow>
            </MenuItem>
          </MobileMenuList>
        ) : (
          <DetailModal>
            <ModalHeader>
              <BackButton onClick={() => setActiveTab('menu')}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </BackButton>
              <ModalTitle>
                {activeTab === 'profile' && '회원정보'}
                {activeTab === 'history' && '프로젝트 히스토리'}
                {activeTab === 'purchases' && '구매내역'}
                {activeTab === 'courses' && '수강중인 강의'}
                {activeTab === 'events' && '이벤트'}
                {activeTab === 'payments' && '결제이력'}
                {activeTab === 'coupons' && '쿠폰관리'}
                {activeTab === 'apiSettings' && 'API 설정'}
              </ModalTitle>
            </ModalHeader>
            <ModalContent>
              {renderTabContent()}
            </ModalContent>
          </DetailModal>
        )}
      </MobileLayout>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
  padding-top: 120px;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const PageHeader = styled.div`
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 2rem;

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const DesktopLayout = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileLayout = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Sidebar = styled.div`
  width: 240px;
  padding: 1rem;
  border-right: 1px solid #eee;

  @media (max-width: 768px) {
    display: none;
  }
`;

const TabButton = styled.button`
  width: 100%;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: none;
  border: none;
  border-radius: 8px;
  color: ${props => props.active ? '#514FE4' : '#666'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? '#f0f4ff' : '#f8f9fa'};
  }

  svg {
    font-size: 1.2rem;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 1rem;
`;

const MobileMenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
  }
`;

const MenuIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #514FE4;
  margin-right: 1rem;
`;

const MenuContent = styled.div`
  flex: 1;
`;

const MenuTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.2rem;
`;

const MenuDescription = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const MenuArrow = styled.div`
  font-size: 1.5rem;
  color: #666;
`;

const DetailModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: 1000;
  padding: 1rem;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  padding: 0.5rem;
  cursor: pointer;
  color: #333;
`;

const ModalTitle = styled.h2`
  margin-left: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
`;

const ModalContent = styled.div`
  padding: 1rem;
  overflow-y: auto;
  height: calc(100vh - 60px);
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const EditButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  color: #514FE4;
`;

const ProjectList = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const ProjectCard = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #eee;
  border-radius: 12px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProjectType = styled.div`
  font-weight: 600;
`;

const ProjectStatus = styled.div`
  padding: 0.2rem 0.5rem;
  background: ${props => props.status === '진행중' ? '#514FE4' : '#f0f0f0'};
  color: ${props => props.status === '진행중' ? 'white' : '#333'};
  border-radius: 4px;
`;

const ProjectTitle = styled.div`
  font-weight: 600;
`;

const ProjectDetails = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const NewInquiryButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  color: #514FE4;
`;

const PurchaseList = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const PurchaseCard = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #eee;
  border-radius: 12px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PurchaseImageWrapper = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
`;

const PurchaseImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PurchaseInfo = styled.div`
  flex: 1;
`;

const PurchaseHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PurchaseType = styled.div`
  font-weight: 600;
`;

const PurchaseDate = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const PurchaseTitle = styled.div`
  font-weight: 600;
`;

const PurchasePrice = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const DownloadButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  color: #514FE4;
`;

const CourseList = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const CourseCard = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #eee;
  border-radius: 12px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CourseImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 12px;
  object-fit: cover;
`;

const CourseInfo = styled.div`
  flex: 1;
`;

const CourseTitle = styled.div`
  font-weight: 600;
`;

const CourseProgress = styled.div`
  margin-bottom: 0.5rem;
`;

const ProgressBar = styled.div`
  height: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 0.2rem;

  &::before {
    content: '';
    display: block;
    height: 100%;
    background: ${props => props.progress > 0 ? '#514FE4' : '#f0f0f0'};
    width: ${props => props.progress}%
  }
`;

const ProgressText = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const CourseDetails = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const ContinueButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  color: #514FE4;
`;

const ProfileGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const ProfileItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const Label = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const Value = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
`;

const EventList = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const EventCard = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #eee;
  border-radius: 12px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EventImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 12px;
  object-fit: cover;
`;

const EventInfo = styled.div`
  flex: 1;
`;

const EventStatus = styled.div`
  padding: 0.2rem 0.5rem;
  background: ${props => props.status === '진행중' ? '#514FE4' : '#f0f0f0'};
  color: ${props => props.status === '진행중' ? 'white' : '#333'};
  border-radius: 4px;
`;

const EventTitle = styled.div`
  font-weight: 600;
`;

const EventPeriod = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const EventBenefit = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const ParticipateButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  color: #514FE4;
`;

const PaymentTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const PaymentStatus = styled.div`
  padding: 0.2rem 0.5rem;
  background: ${props => props.status === '결제완료' ? '#514FE4' : '#f0f0f0'};
  color: ${props => props.status === '결제완료' ? 'white' : '#333'};
  border-radius: 4px;
`;

const CouponList = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const CouponCard = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #eee;
  border-radius: 12px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CouponDiscount = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const CouponInfo = styled.div`
  flex: 1;
`;

const CouponName = styled.div`
  font-weight: 600;
`;

const CouponDetails = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const CouponStatus = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const ViewMode = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EditMode = styled.div`
  margin-top: 1rem;
`;

const InputGroup = styled.div`
  margin-bottom: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #514FE4;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const SaveButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  color: #514FE4;
`;

const CancelButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  color: #514FE4;
`;

const Message = styled.div`
  margin-top: 16px;
  padding: 12px;
  border-radius: 6px;
  background: ${props => props.error ? '#fff3f3' : '#f0f8ff'};
  color: ${props => props.error ? '#e03131' : '#0066cc'};
`;

const HelpText = styled.div`
  margin-top: 24px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
`;

const Link = styled.a`
  color: #514FE4;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default MyPage; 