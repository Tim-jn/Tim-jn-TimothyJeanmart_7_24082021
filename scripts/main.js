import { RecipesCard } from "./utils/constructor.js";
import { searchBar } from "./utils/searchBar.js";
import { generateAndInitLists } from "./utils/filters.js";
export { displayRecipies, LowerCaseNormalize };

// init and create recipies cards

function displayRecipies(recipes) {
  const recipesSection = document.getElementById("recipes");
  recipes.forEach((recipe) => {
    recipesSection.appendChild(new RecipesCard(recipe).buildCard());
  });
}

function LowerCaseNormalize(items) {
  return items
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

searchBar();

