import { recipes } from "./data/recipes.js";
import { RecipesCard } from "./utils/constructor.js";
import { searchBar } from "./utils/searchBar.js";
export { displayRecipies };

// init and create recipies cards

function displayRecipies() {
  const recipesSection = document.getElementById("recipes");
  recipes.forEach((recipe) => {
    recipesSection.appendChild(new RecipesCard(recipe).buildCard());
  });
}

displayRecipies();
searchBar();
