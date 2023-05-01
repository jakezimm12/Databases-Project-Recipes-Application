import * as React from 'react';
import {Link} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const config = require('../config.json');

export default function RandomRecipe() {
  const [randomRecipe, setRandomRecipe] = React.useState({});

  React.useEffect(() => {
  fetch(`http://${config.server_host}:${config.server_port}/random_recipe`)
    .then(res => res.json())
    .then(resJson => setRandomRecipe(resJson));
  }, []);

  const route = `/recipe/${randomRecipe.id}`

  return (
    <React.Fragment>
      <Typography
        variant="h5"
        color="primary"
        sx={{fontWeight: 400}}
        gutterBottom>
        Feeling hungry?
      </Typography>

      <Typography component="p" variant="h4" gutterBottom>
      {randomRecipe.name}
      </Typography>

      <Typography variant="body1" gutterBottom align="left">
      {randomRecipe.description}
      </Typography>

      <Typography variant="body1" gutterBottom>
      {randomRecipe.minute} minutes,
      {randomRecipe.n_ingredients} ingredients,
      {randomRecipe.n_steps} steps,
      </Typography>

      <Button variant="contained" component={Link} to={route}>Make this!</Button>
    </React.Fragment>
  );
};