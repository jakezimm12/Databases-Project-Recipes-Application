import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import '../AllStyles.css'; // Just putting all the style components here rather than having a separate css file for each page (since it's a simple application)

const config = require('../config.json');

export default function RecipeGuesser() {

    return (
        <Container>
            Hello from inside RecipeGuesser component.
        </Container>
    );
};