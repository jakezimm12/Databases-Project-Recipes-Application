# Databases-Project-Recipes-Application
https://user-images.githubusercontent.com/65970260/236685439-bb7bf749-adaa-4f14-a40e-07de620b3c6c.mp4

## Introduction
In the contemporary digital landscape, users are often confronted with an overwhelming number of choices when searching for the ideal recipe. Websites like Food.com, for instance, host over 200,000 recipes, making it challenging for users to find a suitable dish unless they know precisely what they want. RecipeFinder aims to address this issue by providing a more personalized and efficient approach to recipe search and discovery. The primary motivation behind RecipeFinder is to simplify the recipe search process and cater to the unique preferences and dietary needs of each user. This platform is designed with the central goal of enabling users to find specific recipes based on customized parameters, thereby enhancing their overall culinary experience. RecipeFinder allows users to search for recipes using various parameters, such as ingredients, number of steps, preparation time, nutritional value, and more. By customizing the search criteria to match individual preferences and requirements, RecipeFinder facilitates the discovery of new dishes that align with users' distinct tastes. In addition to its core functionality, RecipeFinder encourages community engagement by providing users with the opportunity to share their creations, exchange suggestions, and connect with fellow food enthusiasts. This interactive environment fosters inspiration, creativity, and a shared passion for culinary exploration. RecipeFinder represents a significant advancement in recipe search and discovery by streamlining the process and personalizing it according to each user's unique tastes and preferences. By employing this innovative platform, users can overcome the challenges posed by an abundance of recipe choices and more efficiently navigate the vast culinary landscape.

## Database Schema
User (id)
Number of instances: 236719 instances

Recipe (id, name, user_id, date, description, minute, n_steps, n_ingredients, calories, total_fat, sugar, sodium, protein, saturated_fat)
user_id FOREIGN KEY REFERENCES User (id)
Number of instances: 228172 instances

RecipeStep (recipe_id, step, step_n)
recipe_id FOREIGN KEY REFERENCES Recipe (id)
Number of instances: 696005 instances

Ingredient (id, ingredient)
Number of instances: 13755 instances

RecipeIngredient (recipe_id, ingredient_id)
recipe_id FOREIGN KEY REFERENCES Recipe (id)
ingredient_id FOREIGN KEY REFERENCES Recipe (id)
Number of instances: 2064986 instances

Tag (id, tag)
Number of instances: 551 instances

RecipeTag (recipe_id, tag_id)
recipe_id FOREIGN KEY REFERENCES Recipe (id)
tag_id FOREIGN KEY REFERENCES Tag(id)
Number of instances: 4078500 instances

Rating (user_id, recipe_id, date, rating, review)
user_id FOREIGN KEY REFERENCES User (id)
recipe_id FOREIGN KEY REFERENCES Recipe (id)
Number of instances: 1114719 instances

## ER Diagram
<img width="972" alt="Screen Shot 2023-05-07 at 11 08 51 AM" src="https://user-images.githubusercontent.com/65970260/236685826-22e7e31c-b3f0-4b7c-87fe-1ccbf457e765.png">

## Third Normal Form (3NF) Justification
The schema above is already in its third normal form. Each table adheres to the conditions required for 3NF. Recall that a non-prime attribute is an attribute that is a part of no candidate keys. In the case of the User table, there is only a single attribute (id), which serves as the primary key with no non-prime attributes. The Recipe table is also in 3NF because all non-prime attributes are fully functionally dependent on the primary key (id), and the foreign key user_id establishes a relationship with the User table without introducing any transitive dependencies. The RecipeStep table satisfies 3NF, as the primary key is recipe_id, and the other attributes (step, step_n) are dependent on the recipe_id without any transitive dependencies. Similarly, the Ingredient table adheres to 3NF because there are only two attributes (id and ingredient), with the primary key (id), uniquely determining the ingredient name. The RecipeIngredient table is in 3NF, as it is a linking table with a composite primary key (recipe_id and ingredient_id) that represents a many-to-many relationship between the Recipe and Ingredient tables, with no non-prime attributes or transitive dependencies. The Tag table is also in 3NF since there are only two attributes (id and tag), and the primary key (id) determines the tag name uniquely. The RecipeTag table follows 3NF for a reason similar to that of the RecipeIngredient table. Lastly, the Rating table is in 3NF, as it has a composite primary key (user_id and recipe_id), with non-prime attributes (date, rating, and review) being fully dependent on the primary key and no transitive dependencies present. 

## Check out the [RecipeFinder Project Description PDF](./RecipeFinder%20Project%20Description.pdf) for a more in-depth explanation of the application.
