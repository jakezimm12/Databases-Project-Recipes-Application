import * as React from 'react';
import {Link} from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const config = require('../config.json');

export default function RecipeTable({defaultPageSize, rowsPerPageOptions }) {
  const [recipeData, setRecipeData] = React.useState([]);

  React.useEffect(() => {
  fetch(`http://${config.server_host}:${config.server_port}/top_recipes`)
    .then(res => res.json())
    .then(resJson => setRecipeData(resJson))
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">

        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Average Rating</TableCell>
            <TableCell align="right">Number of Ratings</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {recipeData.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell scope="row" component={Link} to={`/recipe/${row.id}`}>{row.name}</TableCell>
              <TableCell align="right">{row.avg_rating}</TableCell>
              <TableCell align="right">{row.num_rating}</TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>
    </TableContainer>
  );
}