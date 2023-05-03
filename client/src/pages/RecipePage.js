import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {Container, Box, Grid, Paper, Typography} from '@mui/material';

import { Divider, Stack } from '@mui/material';

import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

import Header from '../components/Header';

const config = require('../config.json');

export default function RecipePage() {
  const {recipe_id} = useParams();

  const [recipeData, setRecipeData] = React.useState({});
  const [ingredientData, setIngredientData] = React.useState([]);
  const [tagData, setTagData] = React.useState([]);
  const [stepData, setStepData] = React.useState([]);
  const [commonIngredientData, setCommonIngredientData] = React.useState([]);

  React.useEffect(() => {
  fetch(`http://${config.server_host}:${config.server_port}/recipe/${recipe_id}`)
    .then(res => res.json())
    .then(resJson => setRecipeData(resJson))

  fetch(`http://${config.server_host}:${config.server_port}/recipe/${recipe_id}/ingredient`)
    .then(res => res.json())
    .then(resJson => setIngredientData(resJson))

  fetch(`http://${config.server_host}:${config.server_port}/recipe/${recipe_id}/tag`)
    .then(res => res.json())
    .then(resJson => setTagData(resJson))

  fetch(`http://${config.server_host}:${config.server_port}/recipe/${recipe_id}/step`)
    .then(res => res.json())
    .then(resJson => setStepData(resJson))

  fetch(`http://${config.server_host}:${config.server_port}/recipe/${recipe_id}/common_ingredient`)
    .then(res => res.json())
    .then(resJson => setCommonIngredientData(resJson))
  }, [recipe_id]);

  const stepNumData = stepData.map((step) => ({step_num: `${step.step_n}. ${step.step}`, ...step}))

  return (

    <Container>
      <Header/>
      <Grid container spacing={2} display="flex" direction="row" alignItems="stretch">

        <Grid item xs={12}>
          <Paper sx={{ p: 2,}}>

            <Typography variant="h4" align="left" gutterBottom>
              {recipeData.name}
            </Typography>

            <Box sx={{width: 0, display: "flex", alignItems: "left"}}>
              <Rating name="read-only" value={Number(recipeData.avg_rating)} readOnly precision={0.5} align="left"/>
              <Box sx={{ ml: 1 }}>
                <Typography variant="body1" gutterBottom>
                  {recipeData.avg_rating}
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" align="left" gutterBottom>
            Submitted by {recipeData.user_id}
            </Typography> 

            <Typography variant="body1" align="left" gutterBottom>
            {recipeData.description}
            </Typography>

            <Divider/>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" mt={2}>
              {tagData.map((tag) =>
                <Chip label={tag.tag} color="primary" variant="outlined"/>
              )}
            </Stack>

          </Paper>
        </Grid>


        <Grid item xs={12}>
          <Paper sx={{ p: 2,}}>

            <Typography variant="h5" align="left" gutterBottom>
              Ingredients
            </Typography>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {ingredientData.map((ingredient) =>
                <Chip label={ingredient.ingredient} />
              )}
            </Stack>

          </Paper>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="table">

                <TableHead>
                  <TableRow>
                    <TableCell align="center">Calories</TableCell>
                    <TableCell align="center">Total Fat</TableCell>
                    <TableCell align="center">Saturated Fat</TableCell>
                    <TableCell align="center">Protein</TableCell>
                    <TableCell align="center">Sugar</TableCell>
                    <TableCell align="center">Sodium</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                    <TableRow
                      key={recipeData.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell align="center">{recipeData.calories}</TableCell>
                      <TableCell align="center">{recipeData.total_fat}</TableCell>
                      <TableCell align="center">{recipeData.saturated_fat}</TableCell>
                      <TableCell align="center">{recipeData.protein}</TableCell>
                      <TableCell align="center">{recipeData.sugar}</TableCell>
                      <TableCell align="center">{recipeData.sodium}</TableCell>
                    </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2,}}>

            <Typography variant="h5" align="left" gutterBottom>
              Steps
            </Typography>

            <List>
              {stepNumData.map((step) =>
              <ListItem>
                <ListItemText primary={step.step_num} />
              </ListItem>
              )}
            </List>

          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2,}}>

            <Typography variant="h5" align="left" gutterBottom>
              Similar Recipes
            </Typography>
            <Typography variant="body1" align="left" gutterBottom>
              Have these ingredients but want something else? Here's what else you can make:
            </Typography>
          </Paper>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">

                    <TableHead>
                      <TableRow>
                        <TableCell aling="right">Name</TableCell>
                        <TableCell align="right">Number of Common Ingredients</TableCell>
                        <TableCell align="right">Average Rating</TableCell>
                        <TableCell align="right">Number of Ratings</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {commonIngredientData.map((row) => (
                        <TableRow
                          key={row.name}
                        >
                          <TableCell scope="row" component={Link} to={`/recipe/${row.id}`}>{row.name}</TableCell>
                          <TableCell align="right">{row.num_common_ingredient}</TableCell>
                          <TableCell align="right">{row.avg_rating}</TableCell>
                          <TableCell align="right">{row.num_rating}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>

            </Table>
          </TableContainer>
        </Grid>


      </Grid>
      </Container>
  );
}