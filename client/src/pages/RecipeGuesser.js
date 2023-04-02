import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

// import LazyTable from '../components/LazyTable';
// import SongCard from '../components/SongCard';
const config = require('../config.json');

export default function RecipeGuesser() {
    const [testValues, setTest] = useState([]);

    useEffect(() => {
      fetch(`http://${config.server_host}:${config.server_port}/recipe_guesser`)
        .then(res => res.json())
        .then(resJson => setTest(resJson));
    }, []);
  

    return (
        <Container>
            Hello from inside RecipeGuesser component.\n
            Values of getting a recipe inside our project's database: id: {testValues.id}, name: {testValues.name}
        </Container>
    );
};