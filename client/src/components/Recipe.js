import React from "react";
import style from './recipe.module.css';
  
const Recipe = ({name,description, minute, n_steps, n_ingredients, average_rating, calories, n_ratings, image, ingredients}) =>{
    return(
        <div className={style.recipe}>
            <h1>{name}</h1>
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
<p><strong>Calories: </strong>{calories}</p>
  
            {/* <img className={style.image} src={image} alt=""/> */}
  
        </div>
    );
  
}
export default Recipe;