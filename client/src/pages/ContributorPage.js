import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Link } from 'react-router-dom';
import { Grid, Container, Paper, Typography } from '@mui/material';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { Button, Slider } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Header from '../components/Header';
import RecipeTable from '../components/RecipeTable';

const config = require('../config.json');

const theme = createTheme();

export default function ContributorPage() {
  const [numRecipe, setNumRecipe] = React.useState(10);
  const [tag, setTag] = React.useState('');
  const [ingredient, setIngredient] = React.useState('');

  const [tags, setTags] = React.useState([]);
  const [ingredients, setIngredients] = React.useState([]);
  const [recipeData, setRecipeData] = React.useState([]);

  React.useEffect(() => {
  fetch(`http://${config.server_host}:${config.server_port}/tag_list`)
    .then(res => res.json())
    .then(resJson => setTags(resJson))

  fetch(`http://${config.server_host}:${config.server_port}/ingredient_list`)
    .then(res => res.json())
    .then(resJson => setIngredients(resJson))
  }, []);


  const refresh = () => {
    fetch(`http://${config.server_host}:${config.server_port}/top_contributors/recipe?` +
          `numRecipe=${numRecipe}` + 
          `&tag=${tag}` +
          `&ingredient=${ingredient}`
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

            <Typography component="p" variant="h4" gutterBottom>
              Recipes Rated by Top Contributors
            </Typography>

            <Typography component="p" variant="body1" gutterBottom>
              Do you wonder what recipes are rated high by users submitting a lot of recepies?
              Well, here they are:
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography component="p" variant="body2" align="center" gutterBottom>
                  Number of Recipes Submitted
                </Typography>
                <Slider
                  value={numRecipe}
                  min={0}
                  max={100}
                  step={10}
                  onChange={(e, newValue) => setNumRecipe(newValue)}
                  valueLabelDisplay='auto'
                />
              </Grid>

              <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Tag</InputLabel>
                  <Select
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                  >
                    <MenuItem value={''}>{`None`}</MenuItem>
                  {tags.map((t) => (
                    <MenuItem value={t.tag}>{t.tag}</MenuItem>
                  ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Ingredient</InputLabel>
                  <Select
                    value={ingredient}
                    onChange={(e) => setIngredient(e.target.value)}
                  >
                    <MenuItem value={''}>{`None`}</MenuItem>
                  {ingredients.map((i) => (
                    <MenuItem value={i.ingredient}>{i.ingredient}</MenuItem>
                  ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>


            <Paper sx={{p: 2,}}>
              <Button variant="contained" onClick={() => refresh() }>
                Refresh
              </Button>
            </Paper>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">

                <TableHead>
                  <TableRow>
                    <TableCell aling="right">Name</TableCell>
                    <TableCell align="right">Average Rating</TableCell>
                    <TableCell align="right">Number of Ratings</TableCell>
                    <TableCell align="right">Top Contributors Rating</TableCell>
                    <TableCell align="right">Top Contributors Number</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {recipeData.map((row) => (
                    <TableRow
                      key={row.name}
                    >
                      <TableCell scope="row" component={Link} to={`/recipe/${row.id}`}>{row.name}</TableCell>
                      <TableCell align="right">{row.avg_rating}</TableCell>
                      <TableCell align="right">{row.num_rating}</TableCell>
                      <TableCell align="right">{row.avg_rating_top_contributors}</TableCell>
                      <TableCell align="right">{row.num_rating_top_contributors}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>

              </Table>
            </TableContainer>

        </Container>
    </ThemeProvider>
  );
}