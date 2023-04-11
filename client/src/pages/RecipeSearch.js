import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
// import { NavLink } from 'react-router-dom';

// import LazyTable from '../components/LazyTable';
// import SongCard from '../components/SongCard';
const config = require('../config.json');

export default function RecipeGuesser() {
    const [related_recipes, setRelatedRecipes] = useState([]);
    const [top_contributors_recipes, setTopContributorsRecipes] = useState([]);
    const [specific_ing_recipes, setSpecificIngRecipes] = useState([]);

    useEffect(() => {
        const temp_static_recipe_id = 137739;
        fetch(`http://${config.server_host}:${config.server_port}/given_recipe/${temp_static_recipe_id}`)
            .then(res => res.json())
            .then(resJson => setRelatedRecipes(resJson));
        }, []);

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/top_contributors`)
            .then(res => res.json())
            .then(resJson => setTopContributorsRecipes(resJson));
        }, []);

    useEffect(() => {
        const ingredients = 'chicken,flour,parsley';
        fetch(`http://${config.server_host}:${config.server_port}/specific_ingredients?ingredients=${ingredients}`)
            .then(res => res.json())
            .then(resJson => setSpecificIngRecipes(resJson));
        }, []);

    return (
        <Container>
                This is the RecipeSearch Page.
            <Divider />
                Recipes similar to recipe of id 137739:
                {Array.isArray(related_recipes) && related_recipes.map(recipe => <div>{recipe.name}</div>)}
            <Divider />
                Top Contributors' Recipes:
                {Array.isArray(top_contributors_recipes) && top_contributors_recipes.map(top_contributors_recipe => <div>{top_contributors_recipe.name}</div>)}
            <Divider />
                Specific Ingredients (chicken, parsley, and flour in this case):
                {Array.isArray(specific_ing_recipes) && specific_ing_recipes.map(specific_ing_recipe => <div>{specific_ing_recipe.name}</div>)}
        </Container>
    );
};