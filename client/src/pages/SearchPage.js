import React, { useEffect, useState } from 'react'
import { Container, Divider, Link } from '@mui/material';
import '../AllStyles.css'; // Just putting all the style components here rather than having a separate css file for each page (since it's a simple application)
import Recipe from '../components/Recipe';

const config = require('../config.json');
  
const SearchPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [minCalories, setMinCalories] = useState("");
  const [maxCalories, setMaxCalories] = useState("");
  const [minNumRatings, setMinNumRatings] = useState("");
  const [minRating, setMinRating] = useState("");
  const [maxNumSteps, setMaxNumSteps] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [numResults, setNumResults] = useState(10);
  // const [query, setQuery] = useState({search, minCalories, maxCalories});

  const [searchText, setSearchText] = useState("Loading...");

//   const getSearch = e => {
//     e.preventDefault();
//     // setQuery({search, minCalories, maxCalories});
//     setSearch("");
//     setMinCalories("");
//     setMaxCalories("");
//     setMinNumRatings("");
//     setMinRating("");
//     setMaxNumSteps("");
//     setMaxTime("");
//     setNumResults("");
//   };

  useEffect(() => {
    setSearchText("Loading...");
    if (!search && !minCalories && !maxCalories && !minNumRatings && !minRating && !maxNumSteps && !maxTime) {
      fetch(`http://${config.server_host}:${config.server_port}/top_contributors?numResults=${numResults}`)
        .then(res => res.json())
        .then(resJson => {
          setRecipes(resJson);
          setSearchText("Top recipes from top reviewers!");
        });
        
    } else {
      fetch(`http://${config.server_host}:${config.server_port}/search_filters?` +
        `searchBar=${search}` +
        `&minCalories=${minCalories}&maxCalories=${maxCalories}` + 
        `&minNumRatings=${minNumRatings}` +
        `&minRating=${minRating}` +
        `&maxNumSteps=${maxNumSteps}` +
        `&maxTime=${maxTime}` +
        `&numResults=${numResults}`
      )
        .then(res => res.json())
        .then(resJson => {
          setRecipes(resJson);
          setSearchText("Search Results!");
        });
    }
  }, [search, minCalories, maxCalories, minNumRatings, minRating, minRating, maxNumSteps, maxTime, numResults]);
  
  return (
    <Container>
      {/* <form className="search-form" onSubmit={getSearch}  ></form> */}
      <form className="search-form" >
        <input className="search-bar" type="text" placeholder="Direct Search" value={search}
             onChange={(e) => setSearch(e.target.value)} />
        {/* <button className="search-button" type="submit" >
             Search
        </button> */}
        <div className='recipe-div'>
            <p className="default-text">Min Calories: </p>
            <input
            className="recipe-attribute"
            type="number"
            placeholder="Enter"
            value={minCalories}
            onChange={(e) => setMinCalories(e.target.value)}
            />
        </div>
        <div className='recipe-div'>
            <p className="default-text">Max Calories: </p>
            <input
            className="recipe-attribute"
            type="number"
            placeholder="Enter"
            value={maxCalories}
            onChange={(e) => setMaxCalories(e.target.value)}
            />
        </div>
        <div className='recipe-div'>
            <p className="default-text">Min # of Ratings: </p>
            <input
            className="recipe-attribute"
            type="number"
            placeholder="Enter"
            value={minNumRatings}
            onChange={(e) => setMinNumRatings(e.target.value)}
            />
        </div>
        <div className='recipe-div'>
            <p className="default-text">Min Rating: </p>
            <input
            className="recipe-attribute"
            type="number"
            placeholder="Enter"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            />
        </div>
        <div className='recipe-div'>
            <p className="default-text">Max Num of Steps: </p>
            <input
            className="recipe-attribute"
            type="number"
            placeholder="Enter"
            value={maxNumSteps}
            onChange={(e) => setMaxNumSteps(e.target.value)}
            />
        </div>
        <div className='recipe-div'>
            <p className="default-text">Max Time (mins): </p>
            <input
            className="recipe-attribute"
            type="number"
            placeholder="Enter"
            value={maxTime}
            onChange={(e) => setMaxTime(e.target.value)}
            />
        </div>
        <div className='recipe-div'>
            <p className="default-text"> Num Results: </p>
            <input
            className="recipe-attribute"
            type="number"
            placeholder="Num Results"
            value={numResults}
            onChange={(e) => setNumResults(e.target.value)}
            />
        </div>
      </form>
      <div className="recipes">
        <p className="search-description-text">{recipes.length > 0 ? searchText : "Loading..."}</p>
        {console.log(recipes)}
        {recipes.map(recipe => (
          <Recipe
            key={recipe.id}
            name={recipe.name}
            description={recipe.description}
            minute={recipe.minute}
            n_steps={recipe.n_steps}
            n_ingredients={recipe.n_ingredients}
            average_rating={recipe.average_rating}
            calories={recipe.calories}
            n_ratings={recipe.n_ratings}
          />
        ))}
      </div>
    </Container>
  );
}
  
export default SearchPage;