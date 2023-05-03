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
    SELECT
      *
    FROM Recipe R
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

// GET /search_recipe
const search_recipe = async function(req, res) {
  const name = req.query.name ? `%${req.query.name}%` : '%';

  const ingredient = req.query.ingredient ?? '';
  const ingredients = ingredient!='' ? ingredient.split(',') : [];
  const ingredientsCount = ingredients.length;

  const maxNumIngredient = req.query.maxNumIngredient ?? 20;
  const maxNumSteps = req.query.maxNumSteps ?? 20;
  const maxTime = req.query.maxTime ?? 120;

  const maxCalories = req.query.maxCalories ?? 1000;

  const minNumRatings = req.query.minNumRatings ?? 0;
  const minRating = req.query.minRating ?? 0;

  const pageSize = req.query.page_size ?? 10;

  var query = `
    SELECT
      R.id,
      R.name,
      R.n_steps,
      R.n_ingredients,
      R.minute,
      ROUND(RR.avg_rating, 1) AS avg_rating,
      RR.num_rating
    FROM Recipe R
    JOIN RecipeRating RR
      ON RR.id = R.id
    WHERE R.name LIKE '${name}'
    `;

  if (ingredientsCount > 0) {
    query += `
      AND R.id IN (
        SELECT DISTINCT recipe_id
        FROM RecipeIngredient
        WHERE ingredient_id IN (
          SELECT id
          FROM Ingredient
          WHERE ingredient IN (${ingredients.map((i) => `'${i}'`).join(',')})
        )
        GROUP BY recipe_id
        HAVING COUNT(DISTINCT ingredient_id) = ${ingredientsCount}
      )
    `;
  }

  query += `
    AND R.n_ingredients <= ${maxNumIngredient}
    AND R.n_steps <= ${maxNumSteps}
    AND R.minute <= ${maxTime}
    AND R.calories <= ${maxCalories}
    AND RR.avg_rating >= ${minRating}
    AND RR.num_rating >= ${minNumRatings}
    ORDER BY 7 DESC, 6 DESC
    LIMIT ${pageSize}
  `;
  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      res.json({});
      console.log(err);
    } else {
      res.json(data);
      console.log(query)
    }
  });
};

// Route: GET /recipe/:recipe_id
const recipe = async function(req, res) {
  connection.query(`
    SELECT
      R.*,
      ROUND(RR.avg_rating, 1) AS avg_rating,
      RR.num_rating
    FROM Recipe R
    JOIN RecipeRating RR ON R.id = RR.id
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

// Route: GET /recipe/:recipe_id/common_ingredient
const recipe_common_ingredient= async function(req, res) {
  connection.query(`
    WITH PopularIngredient AS (
       SELECT
           id
       FROM IngredientCount
       LIMIT 10
    ), CommonIngredient AS (
    SELECT
       ri1.recipe_id recipe1_id,
       ri2.recipe_id recipe2_id,
       COUNT(ri1.ingredient_id) num_common_ingredient
    FROM RecipeIngredient ri1
    JOIN RecipeIngredient ri2 ON ri1.ingredient_id = ri2.ingredient_id
    JOIN Recipe R on ri2.recipe_id = R.id
    JOIN RecipeRating RR on R.id = RR.id
    WHERE ri1.recipe_id = ${req.params.recipe_id}
    AND ri1.recipe_id != ri2.recipe_id
    AND ri1.ingredient_id NOT IN (SELECT id FROM PopularIngredient)
    GROUP BY ri1.recipe_id, ri2.recipe_id
    )
    SELECT
        R.id,
        R.name,
        CI.num_common_ingredient,
        ROUND(RR.avg_rating, 1) AS avg_rating,
        RR.num_rating
    FROM CommonIngredient CI
    JOIN Recipe R
        ON R.id = CI.recipe2_id
    JOIN RecipeRating RR
        ON RR.id = R.id
    ORDER BY 3 DESC, RR.score DESC
    LIMIT 10
    ;
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
      console.log('common ingredient ' + data.length)
    }
  });
}

// Route: GET /top_recipes
const top_recipes = async function(req, res) {
  connection.query(`
      SELECT
          R.id,
          R.name,
          R.n_steps,
          R.n_ingredients,
          R.minute,
          ROUND(RR.avg_rating, 1) AS avg_rating,
          RR.num_rating
      FROM Recipe R
      JOIN RecipeRating RR
        ON RR.id = R.id
      ORDER BY score DESC
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

// GET /top_contributors/recipe
const top_contributors_recipe = async function(req, res) {
  const numRecipe = req.query.numRecipe ?? 10;
  const tag = req.query.tag ?? '';
  const ingredient = req.query.ingredient ?? '';

  var query = `
    WITH TopContributors AS (
      SELECT
          R.user_id
      FROM Recipe R
      JOIN Rating R2 ON R2.recipe_id = R.id
  `
  if (tag != '') {
    query += `
      JOIN RecipeTag RT on R.id = RT.recipe_id
      JOIN Tag T on RT.tag_id = T.id
    `
  }

  if (ingredient != '') {
    query += `
      JOIN RecipeIngredient RI on R.id = RI.recipe_id
      JOIN Ingredient I on RI.ingredient_id = I.id
    `
  }

  query += `
      WHERE 1=1
  `

  if (tag != '') {
    query += `
      AND T.tag = '${tag}'
    `
  }

  if (ingredient != '') {
    query += `
      AND I.ingredient = '${ingredient}'
    `
  }

  query += `
      GROUP BY R.user_id
      HAVING COUNT(DISTINCT R.id) >= ${numRecipe}
    )
    SELECT
      R.id,
      R.name,
      ROUND(AVG(R2.rating), 1) AS avg_rating,
      COUNT(R2.rating) AS num_rating,
      ROUND(AVG(CASE WHEN TC.user_id IS NOT NULL THEN R2.rating ELSE NULL END), 1) AS avg_rating_top_contributors,
      COUNT(TC.user_id) AS num_rating_top_contributors
    FROM Recipe R
    JOIN Rating R2 ON R2.recipe_id = R.id
    JOIN RecipeRating RR ON RR.id = R.id
    LEFT JOIN TopContributors TC ON TC.user_id = R2.user_id
    WHERE R.user_id NOT IN (SELECT user_id FROM TopContributors)
    GROUP BY R.id, R.name
    ORDER BY 6 DESC
    LIMIT 10
    ;
  `

  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      console.log("Responding with top_contributors route.");
      console.log(query)
      res.json(data);
    }
  });
}

// GET /top_reviewers/recipe
const top_reviewers_recipe = async function(req, res) {
  const numRecipe = req.query.numRecipe ?? 100;
  const tag = req.query.tag ?? '';
  const ingredient = req.query.ingredient ?? '';

  var query = `
  WITH TopReviewers AS (
    SELECT
        R2.user_id
    FROM Rating R2
  `

  if (tag != '') {
    query += `
      JOIN RecipeTag RT on R2.recipe_id = RT.recipe_id
      JOIN Tag T on RT.tag_id = T.id
    `
  }

  if (ingredient != '') {
    query += `
      JOIN RecipeIngredient RI on R2.recipe_id = RI.recipe_id
      JOIN Ingredient I on RI.ingredient_id = I.id
    `
  }

  query += `
      WHERE 1=1
  `

  if (tag != '') {
    query += `
      AND T.tag = '${tag}'
    `
  }

  if (ingredient != '') {
    query += `
      AND I.ingredient = '${ingredient}'
    `
  }

  query += `
      GROUP BY R2.user_id
      HAVING COUNT(DISTINCT R2.recipe_id) >= ${numRecipe}
    )
    SELECT
      R.id,
      R.name,
      ROUND(AVG(R2.rating), 1) AS avg_rating,
      COUNT(R2.rating) AS num_rating,
      ROUND(AVG(CASE WHEN TR.user_id IS NOT NULL THEN R2.rating ELSE NULL END), 1) AS avg_rating_top_contributors,
      COUNT(TR.user_id) AS num_rating_top_contributors
    FROM Recipe R
    JOIN Rating R2 ON R2.recipe_id = R.id
    JOIN RecipeRating RR ON RR.id = R.id
    LEFT JOIN TopReviewers TR ON TR.user_id = R2.user_id
    WHERE R.user_id NOT IN (SELECT user_id FROM TopReviewers)
    GROUP BY R.id, R.name
    ORDER BY AVG(RR.score) DESC
    LIMIT 10
    ;
  `

  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      console.log("Responding with top_reviewers route.");
      console.log(query)
      res.json(data);
    }
  });
}

// Route: GET /tag_list
const tag_list = async function(req, res) {
  connection.query(`
    SELECT
        tag
    FROM TagCount
    LIMIT 100
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

// Route: GET /ingredient_list
const ingredient_list = async function(req, res) {
  connection.query(`
    SELECT
        ingredient
    FROM IngredientCount
    LIMIT 100
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
  search_recipe,
  random_recipe,
  recipe,
  recipe_ingredient,
  recipe_tag,
  recipe_step,
  recipe_common_ingredient,
  top_recipes,
  top_contributors_recipe,
  top_reviewers_recipe,
  tag_list,
  ingredient_list
}