import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Store from './pages/Store';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Portfolio from './pages/Portfolio';
import PortfolioDetail from './pages/PortfolioDetail';
import SubscribePopup from './components/common/SubscribePopup';
import Class from './pages/Class';
import Auth from './pages/Auth';
import SignUp from './pages/SignUp';
import Inquiry from './pages/Inquiry';
import Payment from './pages/Payment';
import EventLanding from './pages/EventLanding';
import SpecialGift from './pages/SpecialGift';
import MyPage from './pages/MyPage';
import BottomNav from './components/layout/BottomNav';
import Consulting from './pages/Consulting';
import ToyProjects from './pages/ToyProjects';
import ToyProjectsDetail from './pages/ToyProjectsDetail';
import AffiliSmart from './toyprojects/affili-smart/AffiliSmart';
import { EmailProvider } from './contexts/EmailContext';
import { CoupangApiProvider } from './contexts/CoupangApiContext';
import { checkMenuAuth } from './utils/menuAuth';

function AppContent() {
  const [isSubscribePopupOpen, setIsSubscribePopupOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubscribeClick = () => {
    setIsSubscribePopupOpen(true);
  };

  const handleCloseSubscribe = () => {
    setIsSubscribePopupOpen(false);
  };

  return (
    <AppContainer>
      <GlobalStyle />
      <Header 
        onSubscribeClick={handleSubscribeClick}
        onInquiryClick={() => navigate('/inquiry')}  
      />
      <Main>
        <Routes>
          <Route path="/" element={<EventLanding />} />
          <Route path="/home" element={<Home />} />
          <Route path="/special-gift" element={<SpecialGift />} />
          <Route path="/inquiry" element={<Inquiry />} />
          {checkMenuAuth('/auth') && <Route path="/auth" element={<Auth />} />}
          {checkMenuAuth('/signup') && <Route path="/signup" element={<SignUp />} />}
          {checkMenuAuth('/mypage') && <Route path="/mypage" element={<MyPage />} />}
          {checkMenuAuth('/payment') && <Route path="/payment" element={<Payment />} />}
          {checkMenuAuth('/consulting') && <Route path="/consulting" element={<Consulting />} />}
          {checkMenuAuth('/services') && <Route path="/services" element={<Services />} />}
          {checkMenuAuth('/store') && <Route path="/store" element={<Store />} />}
          {checkMenuAuth('/blog') && <Route path="/blog" element={<Blog />} />}
          {checkMenuAuth('/blog') && <Route path="/blog/:id" element={<BlogPost />} />}
          {checkMenuAuth('/portfolio') && <Route path="/portfolio" element={<Portfolio />} />}
          {checkMenuAuth('/portfolio') && <Route path="/portfolio/:id" element={<PortfolioDetail />} />}
          {checkMenuAuth('/class') && <Route path="/class" element={<Class />} />}
          <Route path="/toyprojects">
            <Route index element={<ToyProjects />} />
            <Route path=":id" element={<ToyProjectsDetail />} />
            <Route path="affili-smart" element={<AffiliSmart />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Main>
      <Footer />
      <BottomNav />
      {isSubscribePopupOpen && (
        <SubscribePopup onClose={handleCloseSubscribe} />
      )}
    </AppContainer>
  );
}

function App() {
  return (
    <CoupangApiProvider>
      <EmailProvider>
        <ThemeProvider theme={theme}>
          <AppContent />
        </ThemeProvider>
      </EmailProvider>
    </CoupangApiProvider>
  );
}

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding-bottom: 60px;

  @media (min-width: 769px) {
    padding-bottom: 0;
  }
`;

export default App;