import React from "react";
import style from './recipe.module.css';
import { Link } from 'react-router-dom';
  
const Recipe = ({id, name, description, minute, n_steps, n_ingredients, average_rating, calories, n_ratings}) =>{
    return(
        
        <div className={style.recipe}>
            <Link to={`/recipe/${id}`}>
                <h1>{name}</h1>
            </Link>
            {/* <ol>
                {ingredients.map(ingredient=>(
                    <li>{ingredient.text}</li>
                ))}
            </ol> */}
        
            <p><strong>Description: </strong>{description}</p>
            <p><strong>Number of Ratings: </strong>{n_ratings}</p>
            <p><strong>Rating: </strong>{average_rating}</p>     
            <p><strong>Cook Time(mins): </strong>{minute}</p>
            <p><strong>Number of Steps: </strong>{n_steps}</p>
            <p><strong>Number of Ingredients: </strong>{n_ingredients}</p>
            {/* <p><strong>Ingredients: </strong>{ingredients}</p> Would take to long in the search page to get all ingredients using joins unless we use NoSQL. */}
            <p><strong>Calories: </strong>{calories}</p>

            {/* <img className={style.image} src={image} alt=""/> */}

        </div>
    );
  
}
export default Recipe;