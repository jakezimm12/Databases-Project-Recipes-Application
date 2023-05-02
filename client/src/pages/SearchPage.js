import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Button, Slider, TextField, Typography, Autocomplete } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import {Link} from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

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

  const [recipeData, setRecipeData] = React.useState({});

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
                <TextField label='Recipe name' value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%" }}/>
              </Grid>
              <Grid item xs={6}>
                <TextField label='Ingredient' value={ingredient} onChange={(e) => setIngredient(e.target.value)} style={{ width: "100%" }}/>
              </Grid>
            </Grid>
            
            <Button onClick={() => search() }>
              Search
            </Button>


          </Container>
    </ThemeProvider>
  );
}