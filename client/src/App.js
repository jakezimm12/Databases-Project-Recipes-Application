import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

import HomePage from './pages/HomePage';
import RankingPage from './pages/RankingPage';
import RecipePage from './pages/RecipePage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/ranking" element={<RankingPage/>} />
          <Route path="/recipe/:recipe_id" element={<RecipePage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
