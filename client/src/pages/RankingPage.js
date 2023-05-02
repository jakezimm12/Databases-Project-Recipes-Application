import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Grid, Container, Paper, Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Header from '../components/Header';
import RecipeTable from '../components/RecipeTable';

const config = require('../config.json');

const theme = createTheme();

export default function RankingPage() {
  const [recipeData, setRecipeData] = React.useState([]);

  React.useEffect(() => {
  fetch(`http://${config.server_host}:${config.server_port}/top_recipes`)
    .then(res => res.json())
    .then(resJson => setRecipeData(resJson))
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
          <Container maxWidth="lg">
            <Header/>

            <Typography component="p" variant="h4" gutterBottom>
              Top Recipes
            </Typography>

            <RecipeTable recipeData={recipeData}/>

          </Container>
    </ThemeProvider>
  );
}