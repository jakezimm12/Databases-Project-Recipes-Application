import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Button, Slider, TextField, Typography, Autocomplete } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Header from '../components/Header';
import RecipeTable from '../components/RecipeTable';

const config = require('../config.json');
const theme = createTheme();

export default function SearchPage() {
  const [pageSize, setPageSize] = React.useState(10);

  const [name, setName] = React.useState('');
  const [ingredient, setIngredient] = React.useState('');

  const [maxNumIngredient, setMaxNumIngredient] = React.useState(20)
  const [maxNumSteps, setMaxNumSteps] = React.useState(20);
  const [maxTime, setMaxTime] = React.useState(120);

  const [maxCalories, setMaxCalories] = React.useState(1000);

  const [minNumRatings, setMinNumRatings] = React.useState(0);
  const [minRating, setMinRating] = React.useState(0);

  const [recipeData, setRecipeData] = React.useState([]);

  React.useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_recipe`)
      .then(res => res.json())
      .then(resJson => {
        setRecipeData(resJson);
      });
  }, []);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search_recipe?` +
          `name=${name}` +
          `&ingredient=${ingredient}` +
          `&maxNumIngredient=${maxNumIngredient}` +
          `&maxNumSteps=${maxNumSteps}` +
          `&maxTime=${maxTime}` +
          `&maxCalories=${maxCalories}` + 
          `&minNumRatings=${minNumRatings}` +
          `&minRating=${minRating}`
      )
        .then(res => res.json())
        .then(resJson => {
            if (resJson.length > 0) {
              setRecipeData(resJson);
            }
        });
    }

  return (

    <ThemeProvider theme={theme}>
      <CssBaseline />
      
          <Container maxWidth="lg">
            <Header/>

            <Typography component="p" variant="h4" align="center" gutterBottom>
              Search Recipe
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label='Recipe name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label='Ingredient'
                  value={ingredient}
                  onChange={(e) => setIngredient(e.target.value)}
                  style={{ width: "100%" }}
                  />
              </Grid>

              <Grid item xs={4}>
                <Typography component="p" variant="body2" align="center" gutterBottom>
                  Max Number of Ingredients
                </Typography>
                <Slider
                  value={maxNumIngredient}
                  min={0}
                  max={20}
                  step={1}
                  onChange={(e, newValue) => setMaxNumIngredient(newValue)}
                  valueLabelDisplay='auto'
                />
              </Grid>
              <Grid item xs={4}>
                <Typography component="p" variant="body2" align="center" gutterBottom>
                  Max Number of Steps
                </Typography>
                <Slider
                  value={maxNumSteps}
                  min={0}
                  max={20}
                  step={1}
                  onChange={(e, newValue) => setMaxNumSteps(newValue)}
                  valueLabelDisplay='auto'
                />
              </Grid>
              <Grid item xs={4}>
                <Typography component="p" variant="body2" align="center" gutterBottom>
                  Max Time (Minutes)
                </Typography>
                <Slider
                  value={maxTime}
                  min={0}
                  max={120}
                  step={10}
                  onChange={(e, newValue) => setMaxTime(newValue)}
                  valueLabelDisplay='auto'
                />
              </Grid>

              <Grid item xs={4}>
                <Typography component="p" variant="body2" align="center" gutterBottom>
                  Max Calories
                </Typography>
                <Slider
                  value={maxCalories}
                  min={0}
                  max={1000}
                  step={100}
                  onChange={(e, newValue) => setMaxCalories(newValue)}
                  valueLabelDisplay='auto'
                />
              </Grid>
              <Grid item xs={4}>
                <Typography component="p" variant="body2" align="center" gutterBottom>
                  Min Number of Ratings
                </Typography>
                <Slider
                  value={minNumRatings}
                  min={0}
                  max={1000}
                  step={100}
                  onChange={(e, newValue) => setMinNumRatings(newValue)}
                  valueLabelDisplay='auto'
                />
              </Grid>
              <Grid item xs={4}>
                <Typography component="p" variant="body2" align="center" gutterBottom>
                  Min Rating
                </Typography>
                <Slider
                  value={minRating}
                  min={0}
                  max={5}
                  step={1}
                  onChange={(e, newValue) => setMinRating(newValue)}
                  valueLabelDisplay='auto'
                />
              </Grid>

            </Grid>
            
            <Paper sx={{p: 2,}}>
              <Button variant="contained" onClick={() => search() }>
                Search
              </Button>
            </Paper>

            <RecipeTable recipeData={recipeData}/>

          </Container>
    </ThemeProvider>
  );
}