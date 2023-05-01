import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import GitHubIcon from '@mui/icons-material/GitHub';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Header from '../components/Header';
import TopRecipes from '../components/TopRecipes';

const theme = createTheme();

export default function RankingPage() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
          <Container maxWidth="lg">
            <Header/>

            <TopRecipes/>

          </Container>
    </ThemeProvider>
  );
}