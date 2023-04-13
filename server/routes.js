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

/******************
 * FOOD.COM FINAL PROJECT ROUTES *
 ******************/

// Test Route
const recipe_guesser = async function(req, res) {
  connection.query(`
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

// GET /top_contributors
const top_contributors = async function(req, res) {
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
      r.calories,
      COUNT(DISTINCT tc.user_id) / (SELECT COUNT(user_id) FROM TopContributors) num_top_contributors,
      AVG(rt.rating) avg_rating
    FROM Recipe r
    JOIN Rating rt ON rt.recipe_id = r.id
    JOIN TopContributors tc ON tc.user_id = rt.user_id
    WHERE r.user_id NOT IN (SELECT tc.user_id FROM TopContributors)
    GROUP BY r.id, r.name
    HAVING COUNT(DISTINCT tc.user_id) >= 0.05 * (SELECT COUNT(user_id) FROM TopContributors)
    ORDER BY 3 DESC, 4 DESC
    LIMIT 5
    ;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// GET /specific_ingredients
const specific_ingredients = async function(req, res) {
  const ingredients = req.query.ingredients.split(',');
  connection.query(`
  SELECT DISTINCT r.id, r.name
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
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// GET /search_filters
const search_filters = async function(req, res) {
  // TODO (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
  // Some default parameters have been provided for you, but you will need to fill in the rest
  
  // const title = req.query.title ?? '';
  // const durationLow = req.query.duration_low ?? 60;
  // const durationHigh = req.query.duration_high ?? 660;
  // const playsLow = req.query.plays_low ?? 0;
  // const playsHigh = req.query.plays_high ?? 1100000000;
  // const danceabilityLow = req.query.danceability_low ?? 0;
  // const danceabilityHigh = req.query.danceability_high ?? 1;
  // const energyLow = req.query.energy_low ?? 0;
  // const energyHigh = req.query.energy_high ?? 1;
  // const valenceLow = req.query.valence_low ?? 0;
  // const valenceHigh = req.query.valence_high ?? 1;
  // const explicit = req.query.explicit === 'true' ? 1 : 0;

  const searchBar = req.query.searchBar ?? '';
  const minCalories = req.query.minCalories ?? 0;
  let maxCalories = 100000;
  if(req.query.maxCalories && req.query.maxCalories > 0){
    maxCalories = req.query.maxCalories;
  }

  // Will use this version in the final if we can get the query time lower
  // SELECT id, name, calories, AVG(rating) AS avg_rating
  // FROM Recipe r
  // JOIN Rating ON r.id = Rating.recipe_id
  // WHERE name LIKE '%${searchBar}%'
  // AND calories BETWEEN ${calorieMin} AND ${calorieMax}
  // GROUP BY id, name, calories
  // HAVING COUNT(*) >= 3
  // ORDER BY avg_rating DESC
  // LIMIT 5

  connection.query(`
  SELECT id, name, calories
  FROM Recipe r
  WHERE name LIKE '%${searchBar}%'
  AND calories BETWEEN ${minCalories} AND ${maxCalories}
  LIMIT 5
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err)
      res.json({});
    } else {
      res.json(data);
    }
  });

  // connection.query(`
  //   SELECT song_id, album_id, title, number, duration, plays, danceability, energy, valence, tempo, key_mode, explicit
  //   FROM Songs S
  //   WHERE title LIKE '%${title}%'
  //   AND duration BETWEEN ${durationLow} AND ${durationHigh}
  //   AND plays BETWEEN ${playsLow} AND ${playsHigh}
  //   AND danceability BETWEEN ${danceabilityLow} AND ${danceabilityHigh}
  //   AND energy BETWEEN ${energyLow} AND ${energyHigh}
  //   AND valence BETWEEN ${valenceLow} AND ${valenceHigh}
  //   AND explicit <= ${explicit}
  //   ORDER BY title
  //   `, (err, data) => {
  //     if (err || data.length === 0) {
  //       console.log(err);
  //       res.json({});
  //     } else {
  //       res.json(data);
  //     }
  //   });
}

/******************
 * WARM UP ROUTES *
 ******************/

// Route 1: GET /author/:type
const author = async function(req, res) {
  // TODO (TASK 1): replace the values of name and pennKey with your own
  const name = 'Jacob Zimmerman';
  const pennKey = 'zimjacob';

  // checks the value of type the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  if (req.params.type === 'name') {
    // res.send returns data back to the requester via an HTTP response
    res.send(`Created by ${name}`);
  } else if (req.params.type === 'pennkey') {
    // TODO (TASK 2): edit the else if condition to check if the request parameter is 'pennkey' and if so, send back response 'Created by [pennkey]'
    res.send(`Created by ${pennKey}`);
  } else {
    // we can also send back an HTTP status code to indicate an improper request
    res.status(400).send(`'${req.params.type}' is not a valid author type. Valid types are 'name' and 'pennkey'.`);
  }
}

// Route 2: GET /random
const random = async function(req, res) {
  // you can use a ternary operator to check the value of request query values
  // which can be particularly useful for setting the default value of queries
  // note if users do not provide a value for the query it will be undefined, which is falsey
  const explicit = req.query.explicit === 'true' ? 1 : 0;

  // Here is a complete example of how to query the database in JavaScript.
  // Only a small change (unrelated to querying) is required for TASK 3 in this route.
  connection.query(`
    SELECT *
    FROM Songs
    WHERE explicit <= ${explicit}
    ORDER BY RAND()
    LIMIT 1
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      res.json({
        song_id: data[0].song_id,
        title: data[0].title,
      });
    }
  });
}

/********************************
 * BASIC SONG/ALBUM INFO ROUTES *
 ********************************/

// Route 3: GET /song/:song_id
const song = async function(req, res) {
  // TODO (TASK 4): implement a route that given a song_id, returns all information about the song
  // Most of the code is already written for you, you just need to fill in the query
  const song_id = req.params.song_id;

  connection.query(`
  SELECT *
  FROM Songs
  WHERE song_id = '${song_id}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 4: GET /album/:album_id
const album = async function(req, res) {
  // TODO (TASK 5): implement a route that given a album_id, returns all information about the album
  const album_id = req.params.album_id;

  connection.query(`
  SELECT *
  FROM Albums
  WHERE album_id = '${album_id}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 5: GET /albums
const albums = async function(req, res) {
  // TODO (TASK 6): implement a route that returns all albums ordered by release date (descending)
  // Note that in this case you will need to return multiple albums, so you will need to return an array of objects
  connection.query(`
  SELECT album_id, title, release_date, thumbnail_url
  FROM Albums
  ORDER BY release_date DESC
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 6: GET /album_songs/:album_id
const album_songs = async function(req, res) {
  // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
  const album_id = req.params.album_id;
  
  connection.query(`
  SELECT song_id, title, number, duration, plays
  FROM Songs
  WHERE album_id = '${album_id}'
  ORDER BY number
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

/************************
 * ADVANCED INFO ROUTES *
 ************************/

// Route 7: GET /top_songs
const top_songs = async function(req, res) {
  const page = req.query.page;
  // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  const pageSize = req.query.page_size ?? 10;
  if (!page) {
    // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
    // Hint: you will need to use a JOIN to get the album title as well
    connection.query(`
    SELECT S.song_id, S.title, A.album_id, A.title AS album, S.plays
    FROM Songs S
    JOIN Albums A ON S.album_id = A.album_id
    ORDER BY plays DESC
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  } else {
    // TODO (TASK 10): reimplement TASK 9 with pagination
    // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
    const offset = (page - 1) * pageSize;

    connection.query(`
    SELECT S.song_id, S.title, A.album_id, A.title AS album, S.plays
    FROM Songs S
    JOIN Albums A ON S.album_id = A.album_id
    ORDER BY plays DESC
    LIMIT ${offset}, ${pageSize}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  }
}

// Route 8: GET /top_albums
const top_albums = async function(req, res) {
  // TODO (TASK 11): return the top albums ordered by aggregate number of plays of all songs on the album (descending), with optional pagination (as in route 7)
  // Hint: you will need to use a JOIN and aggregation to get the total plays of songs in an album
  const page = req.query.page;
  // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  const pageSize = req.query.page_size ?? 10;
  if (!page) {
    // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
    // Hint: you will need to use a JOIN to get the album title as well
    connection.query(`
    SELECT A.album_id, A.title, SUM(S.plays) AS plays
    FROM Albums A
    JOIN Songs S ON A.album_id = S.album_id
    GROUP BY A.album_id, A.title
    ORDER BY plays DESC
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  } else {
    // TODO (TASK 10): reimplement TASK 9 with pagination
    // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
    const offset = (page - 1) * pageSize;

    connection.query(`
    SELECT A.album_id, A.title, SUM(S.plays) AS plays
    FROM Albums A
    JOIN Songs S ON A.album_id = S.album_id
    GROUP BY A.album_id, A.title
    ORDER BY plays DESC
    LIMIT ${offset}, ${pageSize}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  }
}

// Route 9: GET /search_albums
const search_songs = async function(req, res) {
  // TODO (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
  // Some default parameters have been provided for you, but you will need to fill in the rest
  const title = req.query.title ?? '';
  const durationLow = req.query.duration_low ?? 60;
  const durationHigh = req.query.duration_high ?? 660;
  const playsLow = req.query.plays_low ?? 0;
  const playsHigh = req.query.plays_high ?? 1100000000;
  const danceabilityLow = req.query.danceability_low ?? 0;
  const danceabilityHigh = req.query.danceability_high ?? 1;
  const energyLow = req.query.energy_low ?? 0;
  const energyHigh = req.query.energy_high ?? 1;
  const valenceLow = req.query.valence_low ?? 0;
  const valenceHigh = req.query.valence_high ?? 1;
  const explicit = req.query.explicit === 'true' ? 1 : 0;

  connection.query(`
    SELECT song_id, album_id, title, number, duration, plays, danceability, energy, valence, tempo, key_mode, explicit
    FROM Songs S
    WHERE title LIKE '%${title}%'
    AND duration BETWEEN ${durationLow} AND ${durationHigh}
    AND plays BETWEEN ${playsLow} AND ${playsHigh}
    AND danceability BETWEEN ${danceabilityLow} AND ${danceabilityHigh}
    AND energy BETWEEN ${energyLow} AND ${energyHigh}
    AND valence BETWEEN ${valenceLow} AND ${valenceHigh}
    AND explicit <= ${explicit}
    ORDER BY title
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
}

module.exports = {
  recipe_guesser,
  given_recipe,
  top_contributors,
  specific_ingredients,
  search_filters,
  author,
  random,
  song,
  album,
  albums,
  album_songs,
  top_songs,
  top_albums,
  search_songs,
}
