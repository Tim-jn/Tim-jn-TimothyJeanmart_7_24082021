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

    // get filtered recipes
    let filteredRecipies = [];

    for (let i = 0; i < recipesList.length; i++) {
      const namesList = lowerCaseNormalize(recipesList[i].name).includes(input);
      const descriptionsList = lowerCaseNormalize(recipesList[i].description).includes(input);
      let ingredientsList = [];

      for (let j = 0; j < recipesList[i].ingredients.length; j++) {
        ingredientsList = lowerCaseNormalize(recipesList[i].ingredients[j].ingredient).includes(
          input
        );
      }

      if (namesList || descriptionsList || ingredientsList) {
        filteredRecipies.push(recipesList[i]);
      }
    }
    if (input.length >= 3) {
      // displays recipes under conditions
      if (filteredRecipies.length > 0) {
        displayRecipes(filteredRecipies);
        generateFiltersLists(filteredRecipies);
        searchOnFiltersList(filteredRecipies, generateFiltersLists);
      } else {
        recipesSection.innerHTML =
          '<div class="missing">Aucune recette ne correspond à votre critère… <br />Vous pouvez chercher « tarte aux pommes », « poisson », etc.</div>';
        generateFiltersLists(filteredRecipies);
        searchOnFiltersList(filteredRecipies, generateFiltersLists);
      }
    } else if (input.length <= 3) {
      recipesList = recipes;
      displayRecipes(recipesList);
      generateFiltersLists(recipesList);
      searchOnFiltersList(recipesList, generateFiltersLists);
    }
  });
}
