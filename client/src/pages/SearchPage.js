import React, { useEffect, useState } from 'react'
import { Container, Divider, Link } from '@mui/material';
import '../AllStyles.css'; // Just putting all the style components here rather than having a separate css file for each page (since it's a simple application)
import Recipe from '../components/Recipe';

const config = require('../config.json');
  
const SearchPage = () => {
  const APP_ID = "7474409c";
  const APP_KEY = "d140d9cc41ce2b71d0796eecb09bb8bc";
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const minCaloriesDefault = 0;
  const [minCalories, setMinCalories] = useState(minCaloriesDefault);
  const maxCaloriesDefault = 10000;
  const [maxCalories, setMaxCalories] = useState(maxCaloriesDefault);
  // const [query, setQuery] = useState({search, minCalories, maxCalories});

  const [searchText, setSearchText] = useState("Loading...");

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
    // setQuery({search, minCalories, maxCalories});
    setSearch("");
    setMinCalories(minCaloriesDefault);
    setMaxCalories(maxCaloriesDefault);
  };

  // useEffect(() => {
  //   fetch(`http://${config.server_host}:${config.server_port}/top_contributors`)
  //       .then(res => res.json())
  //       .then(resJson => setRecipes(resJson));
  //   }, []);

  useEffect(() => {
    setSearchText("Loading...");
    if (!search && (!minCalories || minCalories === minCaloriesDefault) && (!maxCalories || maxCalories === maxCaloriesDefault)) {
      fetch(`http://${config.server_host}:${config.server_port}/top_contributors`)
        .then(res => res.json())
        .then(resJson => {
          setRecipes(resJson);
          setSearchText("Top recipes from top contributors!");
        });
        
    } else {
      fetch(`http://${config.server_host}:${config.server_port}/search_filters?` +
        `searchBar=${search}&minCalories=${minCalories}&maxCalories=${maxCalories}`
      )
        .then(res => res.json())
        .then(resJson => {
          setRecipes(resJson);
          setSearchText("Search Results!");
        });
    }
  }, [search, minCalories, maxCalories]);
  
  return (
    <Container>
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
        <p className="search-description-text">{recipes.length > 0 ? searchText : "Loading..."}</p>
        {console.log(recipes)}
        {recipes.map(recipe => (
          <Recipe
            key={recipe.id}
            title={recipe.name}
            calories={recipe.calories}
          />
        ))}
      </div>
    </Container>
  );
}
  
export default SearchPage;
