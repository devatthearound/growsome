import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/layout/Header.js';
import Footer from './components/layout/Footer.js';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from '../next/growsome/src/app/styles/GlobalStyle.ts';
import theme from '../next/growsome/src/app/styles/theme.ts';
import BlogList from './components/blog/BlogList.js';
import BlogPost from './components/blog/BlogPost.js';
import Portfolio from './pages/Portfolio.js';
import PortfolioDetail from './pages/PortfolioDetail.js';
import SubscribePopup from './components/common/SubscribePopup.js';
import Home from './pages/Home.js'; 
import Class from './pages/Class.js';
import Auth from './pages/Auth.js';
import SignUp from './pages/SignUp.js';
import Inquiry from './pages/Inquiry.js';
import Payment from './pages/Payment.js';
import EventLanding from './pages/EventLanding.js';
import SpecialGift from './pages/SpecialGift.js';
import MyPage from './pages/MyPage.js';
import BottomNav from './components/layout/BottomNav.js';
import Consulting from './pages/Consulting.js';
import ToyProjects from './pages/ToyProjects.js';
import ToyProjectsDetail from './pages/ToyProjectsDetail.js';
import AffiliSmart from './toyprojects/affili-smart/AffiliSmart.js';
import { EmailProvider } from './_contexts/EmailContext.js';
import { CoupangApiProvider } from './_contexts/CoupangApiContext.js';
import { checkMenuAuth } from './_utils/menuAuth.js';
import Services from './components/home/Services.js';
import Store from './components/home/Store.js';

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
          {/* <Route path="/" element={<EventLanding />} />
          <Route path="/home" element={<Home />} /> */}
          {/* <Route path="/special-gift" element={<SpecialGift />} /> */}
          {/* <Route path="/inquiry" element={<Inquiry />} /> */}
          {/* {checkMenuAuth('/auth') && <Route path="/auth" element={<Auth />} />} */}
          {/* {checkMenuAuth('/signup') && <Route path="/signup" element={<SignUp />} />} */}
          {/* {checkMenuAuth('/mypage') && <Route path="/mypage" element={<MyPage />} />} */}
          {/* {checkMenuAuth('/payment') && <Route path="/payment" element={<Payment />} />} */}
          {/* {checkMenuAuth('/consulting') && <Route path="/consulting" element={<Consulting />} />} */}
          {/* {checkMenuAuth('/services') && <Route path="/services" element={<Services />} />} */}
          {/* {checkMenuAuth('/store') && <Route path="/store" element={<Store />} />} */}
          {/* {checkMenuAuth('/blog') && <Route path="/blog" element={<BlogList />} />} */}
          {/* {checkMenuAuth('/blog') && <Route path="/blog/:slug" element={<BlogPost />} />} */}
          {/* {checkMenuAuth('/portfolio') && <Route path="/portfolio" element={<Portfolio />} />} */}
          {/* {checkMenuAuth('/portfolio') && <Route path="/portfolio/:id" element={<PortfolioDetail />} />} */}
          {/* {checkMenuAuth('/class') && <Route path="/class" element={<Class />} />} */}
          <Route path="/toyprojects">
            {/* <Route index element={<ToyProjects />} /> */}
            {/* <Route path=":id" element={<ToyProjectsDetail />} /> */}
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