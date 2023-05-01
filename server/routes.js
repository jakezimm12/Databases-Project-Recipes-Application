const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

// Route: GET /random_recipe
const random_recipe = async function(req, res) {
  connection.query(`
<<<<<<< Updated upstream
  SELECT id, name FROM Recipe
  WHERE name='Bourbon Pecan Pound Cake'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json({
        id: data[0].id,
        name: data[0].name,
      });
    }
  });
}

// GET /given_recipe/:recipe_id
const given_recipe = async function(req, res) {
  const recipe_id = req.params.recipe_id;
  console.log(recipe_id);

  connection.query(`
    WITH GivenRecipe AS (
      SELECT DISTINCT *
      FROM Recipe r
      JOIN RecipeIngredient ri on r.id = ri.recipe_id
      WHERE r.id = ${recipe_id}
    )
    SELECT
      r.id,
      r.name,
      AVG(rt.rating) as avg_rating,
      r.calories,
      COUNT(DISTINCT ri.ingredient_id) AS num_common_ingredients
    FROM Recipe r
    JOIN RecipeIngredient ri on r.id = ri.recipe_id
    JOIN Rating rt ON rt.recipe_id = r.id
    WHERE r.id <> ${recipe_id}
    AND r.calories BETWEEN (SELECT AVG(0.9 * calories) FROM GivenRecipe) AND (SELECT AVG(1.1 * calories) FROM GivenRecipe)
    AND ri.ingredient_id IN (
      SELECT DISTINCT ingredient_id
      FROM GivenRecipe
    )
    GROUP BY r.id, r.name
    ORDER BY num_common_ingredients DESC, avg_rating DESC
    LIMIT 5
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// GET /specific_ingredients/ingredients
const specific_ingredients = async function(req, res) {
  const ingredients = req.params.ingredients.split(',');
  connection.query(`
  SELECT DISTINCT
    r.id,
    r.name,
    r.description,
    r.minute,
    r.n_steps,
    r.n_ingredients,
    r.calories,
    r.average_rating,
    r.n_ratings
  FROM Recipe r
  JOIN RecipeIngredient ri on r.id = ri.recipe_id
  JOIN Ingredient i ON i.id = ri.ingredient_id
  WHERE i.ingredient IN (?)
  GROUP BY r.id, r.name
  HAVING COUNT(DISTINCT ri.ingredient_id) = ?
  LIMIT 5
  ;  
  `, [ingredients, ingredients.length], (err, data) => {
    if (err || data.length === 0) {
      console.log("here");
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// GET /top_contributors
const top_contributors = async function(req, res) {
  let numResults = 10;
  if(req.query.numResults && req.query.numResults >= 0){
    numResults = req.query.numResults;
  }

  connection.query(`
    WITH TopContributors AS (
      SELECT
          r.user_id
      FROM Recipe r
      JOIN Rating rt ON rt.recipe_id = r.id
      GROUP BY r.user_id
      HAVING COUNT(DISTINCT r.id)>=20
      AND AVG(rt.rating)>=4.5
    )
    SELECT
      r.id,
      r.name,
      r.description,
      r.minute,
      r.n_steps,
      r.n_ingredients,
      r.calories,
      r.average_rating,
      r.n_ratings,
      COUNT(DISTINCT tc.user_id) / (SELECT COUNT(user_id) FROM TopContributors) num_top_contributors
    FROM Recipe r
    JOIN Rating rt ON rt.recipe_id = r.id
    JOIN TopContributors tc ON tc.user_id = rt.user_id
    WHERE r.user_id NOT IN (SELECT tc.user_id FROM TopContributors)
    GROUP BY r.id, r.name
    HAVING COUNT(DISTINCT tc.user_id) >= 0.05 * (SELECT COUNT(user_id) FROM TopContributors)
    ORDER BY average_rating DESC, num_top_contributors DESC
    LIMIT ${numResults}
    ;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      console.log("Responding with top_contributors route.");
      res.json(data);
    }
  });
}

// GET /search_filters
const search_filters = async function(req, res) {
  const searchBar = req.query.searchBar ?? '';
  let ingredients = '';
  if (req.query.ingredients && req.query.ingredients.trim() !== '') {
    ingredients = req.query.ingredients.trim().split(',');
  }
  let ingredientsCount = 0;
  if (ingredients) {
    ingredientsCount = ingredients.length;
  }
  console.log("Ingredients: " + ingredients[0] + ingredients[1]);
  let minCalories = 0;
  if(req.query.minCalories && req.query.minCalories >= 0){
    minCalories = req.query.minCalories;
  }
  let maxCalories = 100000;
  if(req.query.maxCalories && req.query.maxCalories > 0){
    maxCalories = req.query.maxCalories;
  }
  let minNumRatings = 0;
  if(req.query.minNumRatings && req.query.minNumRatings >= 0){
    minNumRatings = req.query.minNumRatings;
  }
  let minRating = 0;
  if(req.query.minRating && req.query.minRating >= 0){
    minRating = req.query.minRating;
  }
  let maxNumSteps = 10000;
  if(req.query.maxNumSteps && req.query.maxNumSteps > 0){
    maxNumSteps = req.query.maxNumSteps;
  }
  let maxTime = 10000;
  if(req.query.maxTime && req.query.maxTime > 0){
    maxTime = req.query.maxTime;
  }
  let numResults = 10;
  if(req.query.numResults && req.query.numResults >= 0){
    numResults = req.query.numResults;
  }

  let query = `
    SELECT
      id,
      name,
      description,
      minute,
      n_steps,
      n_ingredients,
      calories,
      average_rating,
      n_ratings
=======
    SELECT
      *
>>>>>>> Stashed changes
    FROM Recipe
    WHERE LENGTH(description)>=1000
    ORDER BY RAND()
    LIMIT 1
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0])
    }
  });
}

// Route: GET /recipe/:recipe_id
const recipe = async function(req, res) {
  connection.query(`
    SELECT
      R.*,
      ROUND(RR.avg_rating, 1) AS avg_rating,
      RR.num_rating
    FROM Recipe R
    JOIN RecipeRating RR ON R.name = RR.name
    WHERE R.id = '${req.params.recipe_id}'
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
      console.log('recipe id ' + data[0].id)
    }
  });
}

// Route: GET /recipe/:recipe_id/ingredient
const recipe_ingredient = async function(req, res) {
  connection.query(`
    SELECT
      I.ingredient
    FROM RecipeIngredient RI
    JOIN Ingredient I ON RI.ingredient_id = I.id
    WHERE RI.recipe_id = '${req.params.recipe_id}'
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
      console.log('ingredient ' + data.length)
    }
  });
}

// Route: GET /recipe/:recipe_id/tag
const recipe_tag= async function(req, res) {
  connection.query(`
    SELECT
        T.tag
    FROM RecipeTag RT
    JOIN Tag T ON RT.tag_id = T.id
    WHERE RT.recipe_id = '${req.params.recipe_id}'
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
      console.log('tag ' + data.length)
    }
  });
}

// Route: GET /recipe/:recipe_id/step
const recipe_step= async function(req, res) {
  connection.query(`
    SELECT
      *
    FROM RecipeStep RS
    WHERE RS.recipe_id = '${req.params.recipe_id}'
    ORDER BY RS.step_n
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
      console.log('step ' + data.length)
    }
  });
}

// Route: GET /top_recipes
const top_recipes = async function(req, res) {
  connection.query(`
    SELECT
        R.id,
        R.name,
        AVG(R2.rating) AS avg_rating,
        COUNT(R2.rating) AS num_rating,
        AVG(R2.rating) * COUNT(R2.rating) / (SELECT COUNT(DISTINCT user_id) FROM Rating) AS score
    FROM Recipe R
    JOIN Rating R2 ON R.id = R2.recipe_id
    GROUP BY R.id, R.name
    ORDER BY 4 DESC
    LIMIT 10
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
      console.log(data.length)
    }
  });
}

// Route: GET /top_tags
const top_tags = async function(req, res) {
  connection.query(`
    WITH Tag AS (
        SELECT * FROM Tag ORDER BY Tag LIMIT 10
    )
    SELECT
        T.id,
        T.tag,
        COUNT(RT.recipe_id) AS num_recipe,
        AVG(R2.rating) AS avg_rating,
        COUNT(R2.rating) AS num_rating,
        AVG(R2.rating) * COUNT(R2.rating) / (SELECT COUNT(DISTINCT user_id) FROM Rating) AS score
    FROM Tag T
    JOIN RecipeTag RT ON T.id = RT.tag_id
    JOIN Rating R2 ON R2.recipe_id = RT.recipe_id
    GROUP BY T.id, T.tag
    ORDER BY 6 DESC
    LIMIT 10
    ;
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
      console.log(data.length)
    }
  });
}


module.exports = {
  random_recipe,
  recipe,
  recipe_ingredient,
  recipe_tag,
  recipe_step,
  top_recipes,
  top_tags
}