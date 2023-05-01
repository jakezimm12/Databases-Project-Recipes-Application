import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

import HomePage from './pages/HomePage';
import RankingPage from './pages/RankingPage';
import RecipePage from './pages/RecipePage';
import SearchPage from './pages/SearchPage';
import RecipeGuesser from './pages/RecipeGuesser';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/ranking" element={<RankingPage/>} />
          <Route path="/recipe/:recipe_id" element={<RecipePage/>} />
          <Route path="/search" element={<SearchPage/>} />
          <Route path="/quiz" element={<RecipeGuesser/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
