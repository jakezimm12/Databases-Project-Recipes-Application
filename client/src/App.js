import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

import HomePage from './pages/HomePage';
import RecipePage from './pages/RecipePage';
import SearchPage from './pages/SearchPage';
import RankingPage from './pages/RankingPage';
import ContributorPage from './pages/ContributorPage';
import ReviewerPage from './pages/ReviewerPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/recipe/:recipe_id" element={<RecipePage/>} />
          <Route path="/search" element={<SearchPage/>} />
          <Route path="/ranking" element={<RankingPage/>} />
          <Route path="/contributor" element={<ContributorPage/>} />
          <Route path="/reviewer" element={<ReviewerPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
