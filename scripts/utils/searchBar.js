import { recipes } from "../data/recipes.js";
import { displayRecipies, LowerCaseNormalize } from "../main.js";
export { searchBar, searchBarFilter, searchedElements };

// algorithm that show only recipes including the searched items
// optimized to ignore capital letters and accents

let searchedElements = [];
let searchBarFilter = false;

function searchBar() {
  displayRecipies(recipes);
  const searchInput = document.getElementById("site-search");
  const recipesSection = document.getElementById("recipes");

  searchInput.addEventListener("keyup", (e) => {
    const input = e.target.value.toLowerCase();
    const filteredRecipies = recipes.filter((recipe) => {
      const recipeIngredients = recipe.ingredients.map((element) => element.ingredient).toString();
      return (
        LowerCaseNormalize(recipe.name).includes(input) ||
        LowerCaseNormalize(recipeIngredients).includes(input) ||
        LowerCaseNormalize(recipe.description).includes(input)
      );
    });

    recipesSection.innerHTML = "";

    if (input.length >= 3) {
      if (filteredRecipies.length > 0) {
        displayRecipies(filteredRecipies);
        searchedElements.length = 0;
        filteredRecipies.map((element) => searchedElements.push(element));
        return (searchBarFilter = true);
      } else {
        recipesSection.innerHTML =
          '<div class="missing">Aucune recette ne correspond à votre critère… <br />Vous pouvez chercher « tarte aux pommes », « poisson », etc.</div>';
        return (searchBarFilter = true);
      }
    } else if (input.length < 3) {
      displayRecipies(recipes);
      return (searchBarFilter = false);
    }

  });
}
