import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Blog from './pages/Blog';
// other imports...

function App() {
  return (
    <Router>
      <Routes>
        {/* other routes */}
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </Router>
  );
}

export default App; 