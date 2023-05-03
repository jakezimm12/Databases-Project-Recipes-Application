const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js

app.get('/random_recipe', routes.random_recipe);
app.get('/recipe/:recipe_id', routes.recipe);
app.get('/recipe/:recipe_id/ingredient', routes.recipe_ingredient);
app.get('/recipe/:recipe_id/tag', routes.recipe_tag);
app.get('/recipe/:recipe_id/step', routes.recipe_step);
app.get('/recipe/:recipe_id/common_ingredient', routes.recipe_common_ingredient);

app.get('/search_recipe', routes.search_recipe);
app.get('/top_recipes', routes.top_recipes);
app.get('/top_contributors/recipe', routes.top_contributors_recipe);
app.get('/top_reviewers/recipe', routes.top_reviewers_recipe);
app.get('/tag_list', routes.tag_list);
app.get('/ingredient_list', routes.ingredient_list);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
