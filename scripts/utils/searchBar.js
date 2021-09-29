import { LowerCaseNormalize, displayRecipes, generateFiltersLists } from "../main.js";
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

    // get filtered recipes
    let filteredRecipies = [];

    for (let i = 0; i < recipesList.length; i++) {
      const ingredientsList = recipesList.map((recipe) => {
        const recipeIngredients = recipe.ingredients
          .map((element) => element.ingredient)
          .toString();
        return recipeIngredients;
      });

      const ingredientsFiltered = lowerCaseNormalize(ingredientsList[i]).includes(input);
      const nameFiltered = lowerCaseNormalize(recipesList[i].name).includes(input);
      const descriptionFiltered = lowerCaseNormalize(recipesList[i].description).includes(input);

      if (ingredientsFiltered || nameFiltered || descriptionFiltered) {
        filteredRecipies.push(recipesList[i]);
      }
    }

    // displays recipes under conditions
    if (input.length >= 3) {
      if (filteredRecipies.length > 0) {
        displayRecipes(filteredRecipies);
        generateFiltersLists(filteredRecipies);
        searchOnFiltersList(filteredRecipies, generateFiltersLists);
      } else {
        recipesSection.innerHTML =
          '<div class="missing">Aucune recette ne correspond à votre critère… <br />Vous pouvez chercher « tarte aux pommes », « poisson », etc.</div>';
      }
    } else if (input.length <= 3) {
      recipesList = recipes;
      displayRecipes(recipesList);
      generateFiltersLists(recipesList);
      searchOnFiltersList(recipesList, generateFiltersLists);
    }
  });
}
