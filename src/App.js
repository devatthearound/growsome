import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
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

function App() {
  const [isSubscribePopupOpen, setIsSubscribePopupOpen] = useState(false);

  const handleSubscribeClick = () => {
    setIsSubscribePopupOpen(true);
  };

  return (
    <CoupangApiProvider>
      <EmailProvider>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <AppContainer>
              <GlobalStyle />
              <Header onSubscribeClick={handleSubscribeClick} />
              <Main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/store" element={<Store />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<BlogPost />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/portfolio/:id" element={<PortfolioDetail />} />
                  <Route path="/class" element={<Class />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/inquiry" element={<Inquiry />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/free-registration" element={<EventLanding />} />
                  <Route path="/special-gift" element={<SpecialGift />} />
                  <Route path="/mypage" element={<MyPage />} />
                  <Route path="/consulting" element={<Consulting />} />
                  <Route path="/toy-projects" element={<ToyProjects />} />
                  <Route path="/toy-projects/:id" element={<ToyProjectsDetail />} />
                  <Route path="/toyprojects/affili-smart" element={<AffiliSmart />} />
                </Routes>
              </Main>
              <Footer />
              <BottomNav />
              <SubscribePopup 
                isOpen={isSubscribePopupOpen} 
                onClose={() => setIsSubscribePopupOpen(false)} 
              />
            </AppContainer>
          </ThemeProvider>
        </BrowserRouter>
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