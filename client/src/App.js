import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import './AllStyles.css'; // Just putting all the style components here rather than having a separate css file for each page (since it's a simple application)


import NavBar from './components/NavBar';
import RecipeGuesser from "./pages/RecipeGuesser";
import SearchPage from "./pages/SearchPage";

// App is the root component of our application and as children contain all our pages
// We use React Router's BrowserRouter and Routes components to define the pages for
// our application, with each Route component representing a page and the common
// NavBar component allowing us to navigate between pages (with hyperlinks)
export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<SearchPage />} /> {/*SearchPage is the home page.*/}
          <Route path="/recipe_guesser" element={<RecipeGuesser />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}