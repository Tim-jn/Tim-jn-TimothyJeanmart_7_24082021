import { lowerCaseNormalize, displayRecipes, generateFiltersLists } from "../main.js";
import { searchOnFiltersList } from "./filters.js";
import { recipes } from "../data/recipes.js";

export { searchBar };

// search on navbar

function searchBar(recipesList) {
  const searchInput = document.getElementById("site-search");
  const recipesSection = document.getElementById("recipes");

  // listen search bar input
  searchInput.addEventListener("keyup", (e) => {
    const input = lowerCaseNormalize(e.target.value);
    // get filtered recipes object
    let filteredRecipies = recipesList.filter((recipe) => {
      const recipeIngredients = recipe.ingredients.map((element) => element.ingredient).toString();
      return (
        lowerCaseNormalize(recipe.name).includes(input) ||
        lowerCaseNormalize(recipeIngredients).includes(input) ||
        lowerCaseNormalize(recipe.description).includes(input)
      );
    });

    // displays recipes under conditions
    if (input.length >= 3) {
      if (filteredRecipies.length > 0) {
        recipesList = filteredRecipies;
        displayRecipes(recipesList);
        generateFiltersLists(recipesList);
        searchOnFiltersList(recipesList, generateFiltersLists);
      } else {
        recipesSection.innerHTML =
          '<div class="missing">Aucune recette ne correspond à votre critère… <br />Vous pouvez chercher « tarte aux pommes », « poisson », etc.</div>';
        generateFiltersLists(recipesList);
        searchOnFiltersList(recipesList, generateFiltersLists);
      }
    } else if (input.length <= 3) {
      recipesList = recipes;
      displayRecipes(recipesList);
      generateFiltersLists(recipesList);
      searchOnFiltersList(recipesList, generateFiltersLists);
    }
  });
}
