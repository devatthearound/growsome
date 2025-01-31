import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

  return (
    <CoupangApiProvider>
      <EmailProvider>
        <Router>
          <ThemeProvider theme={theme}>
            <AppContainer>
              <GlobalStyle />
              <Header />
              <Main>
                <Routes>
                  <Route path="/" element={<EventLanding />} />
                  <Route path="/special-gift" element={<SpecialGift />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Main>
              <Footer />
              <BottomNav />
            </AppContainer>
          </ThemeProvider>
        </Router>
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