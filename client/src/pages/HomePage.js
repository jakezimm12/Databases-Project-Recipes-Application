import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import GitHubIcon from '@mui/icons-material/GitHub';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Header from '../components/Header';
import RandomRecipe from '../components/RandomRecipe';

const theme = createTheme();

export default function HomePage() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

          <Container maxWidth="lg">
            <Header/>

            {/* Random Recipe */}
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <Paper sx={{p: 2,}}>
                    <RandomRecipe/>
                </Paper>
              </Grid>

            </Grid>
          </Container>
    </ThemeProvider>
  );
}