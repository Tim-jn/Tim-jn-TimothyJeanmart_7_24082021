import { recipes } from "./data/recipes.js";
import { RecipesCard } from "./utils/constructor.js";
export { init };

// init and create recipies cards

function init() {
  const recipesSection = document.getElementById("recipes");
  recipes.forEach((recipe) => {
    recipesSection.appendChild(new RecipesCard(recipe).buildCard(recipe));
  });
}

init()
