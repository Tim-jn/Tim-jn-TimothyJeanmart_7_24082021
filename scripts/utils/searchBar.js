import { LowerCaseNormalize, displayRecipes, generateFiltersLists } from "../main.js";
import { recipes } from "../data/recipes.js";

export { searchBar };

// search on navbar

function searchBar(recipesList) {
  const searchInput = document.getElementById("site-search");
  const recipesSection = document.getElementById("recipes");

  // listen search bar input
  searchInput.addEventListener("keyup", (e) => {
    const input = LowerCaseNormalize(e.target.value);
    // get filtered recipes object
    let filteredRecipies = recipesList.filter((recipe) => {
      const recipeIngredients = recipe.ingredients.map((element) => element.ingredient).toString();
      return (
        LowerCaseNormalize(recipe.name).includes(input) ||
        LowerCaseNormalize(recipeIngredients).includes(input) ||
        LowerCaseNormalize(recipe.description).includes(input)
      );
    });

    // displays recipes under conditions
    if (input.length >= 3) {
      if (filteredRecipies.length > 0) {
        recipesList = filteredRecipies;
        displayRecipes(recipesList);
        generateFiltersLists(recipesList);
      } else {
        recipesSection.innerHTML =
          '<div class="missing">Aucune recette ne correspond à votre critère… <br />Vous pouvez chercher « tarte aux pommes », « poisson », etc.</div>';
      }
    } else if (input.length <= 3) {
      recipesList = recipes;
      displayRecipes(recipesList);
      generateFiltersLists(recipesList);
    }
  });
}
