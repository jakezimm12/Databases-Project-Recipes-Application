import React, { useEffect, useState } from 'react'
import './App.css';
import Recipe from './Recipe';
import NavBar from './components/NavBar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container, Divider, Link } from '@mui/material';


const config = require('./config.json');
  
const App = () => {
  const APP_ID = "7474409c";
  const APP_KEY = "d140d9cc41ce2b71d0796eecb09bb8bc";
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [minCalories, setMinCalories] = useState(0);
  const [maxCalories, setMaxCalories] = useState(10000);
  const [query, setQuery] = useState({search, minCalories, maxCalories});


  // useEffect(() => {
  //   getRecipes();
  // }, [query])
  // const getRecipes = async () => {
  //   const response = await fetch
  //         (`https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`);
  //   const data = await response.json();
  //   setRecipes(data.hits);
  //   // console.log(data);
  // };

  const updateSearch = e => {
    setSearch(e.target.value);
  };

  const getSearch = e => {
    e.preventDefault();
    setQuery({search, minCalories, maxCalories});
    setSearch("");
    setMinCalories(0);
    setMaxCalories("");
  };

  // useEffect(() => {
  //   fetch(`http://${config.server_host}:${config.server_port}/top_contributors`)
  //       .then(res => res.json())
  //       .then(resJson => setRecipes(resJson));
  //   }, []);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_filters?` +
      `searchBar=${search}&minCalories=${minCalories}&maxCalories=${maxCalories}`
    )
        .then(res => res.json())
        .then(resJson => setRecipes(resJson));
    }, [query, search, minCalories, maxCalories]);
  
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
      <form className="search-form" onSubmit={getSearch}  >
        <input className="search-bar" type="text" value={search}
             onChange={updateSearch} />
        <button className="search-button" type="submit" >
             Search
        </button>
        <input
          className="recipe-attribute"
          type="number"
          placeholder="Minimum calories"
          value={minCalories}
          onChange={(e) => setMinCalories(e.target.value)}
        />
        <input
          className="recipe-attribute"
          type="number"
          placeholder="Maximum calories"
          value={maxCalories}
          onChange={(e) => setMaxCalories(e.target.value)}
        />
      </form>
      <div className="recipes">

        {recipes.map(recipe => (
          <Recipe
            key={recipe.id}
            title={recipe.name}
            calories={recipe.calories}
          />

          // <Recipe
          //   key={recipe.recipe.label}
          //   title={recipe.recipe.label}
          //   calories={recipe.recipe.calories}
          //   image={recipe.recipe.image}
          //   ingredients={recipe.recipe.ingredients}
          // />
  
        ))}
      </div>
    </div>
  );
}
  
export default App;
