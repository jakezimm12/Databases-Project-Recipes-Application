import * as React from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';

const config = require('../config.json');

export default function RecipeTable({recipeData}) {

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">

        <TableHead>
          <TableRow>
            <TableCell aling="right">Name</TableCell>
            <TableCell align="right">Number of Ingredients</TableCell>
            <TableCell align="right">Number of Steps</TableCell>
            <TableCell align="right">Minutes</TableCell>
            <TableCell align="right">Average Rating</TableCell>
            <TableCell align="right">Number of Ratings</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {recipeData.map((row) => (
            <TableRow
              key={row.name}
            >
              <TableCell scope="row" component={Link} to={`/recipe/${row.id}`}>{row.name}</TableCell>
              <TableCell align="right">{row.n_ingredients}</TableCell>
              <TableCell align="right">{row.n_steps}</TableCell>
              <TableCell align="right">{row.minute}</TableCell>
              <TableCell align="right">{row.avg_rating}</TableCell>
              <TableCell align="right">{row.num_rating}</TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>
    </TableContainer>
  );
}