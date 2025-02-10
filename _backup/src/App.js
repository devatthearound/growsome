import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Blog from './app/product/purchase/Blog';
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