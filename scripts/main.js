import { recipes } from "./data/recipes.js";
import { RecipesCard } from "./utils/constructor.js";
import { searchBar } from "./utils/searchBar.js";
import { init, createFiltersLists } from "./utils/filters.js";

export { LowerCaseNormalize, displayRecipes, generateFiltersLists };

function getData(recipesList) {
  recipesList = data();
  init(recipesList);
}

function data() {
  const searchInput = document.getElementById("site-search");
  let recipesList = recipes;
  if (searchInput.value >= 3) {
    recipesList = searchBar(recipesList);
  }
  return recipesList;
}

function displayRecipes(recipesList) {
  const recipesSection = document.getElementById("recipes");
  recipesSection.innerHTML = "";
  recipesList.forEach((recipe) => {
    recipesSection.appendChild(new RecipesCard(recipe).buildCard());
  });
}

function LowerCaseNormalize(items) {
  return items
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function generateFiltersLists(recipesList, ingredientsList, appliancesList, ustensilsList) {
  let ingredients = [];
  let appliances = [];
  let ustensils = [];

  recipesList.forEach((recipe) => {
    recipe.ingredients.map((element) => ingredients.push(element.ingredient));
    appliances.push(recipe.appliance);
    recipe.ustensils.map((element) => ustensils.push(element));
  });

  ingredientsList = [...new Set(ingredients)].sort();
  appliancesList = [...new Set(appliances)].sort();
  ustensilsList = [...new Set(ustensils)].sort();

  createFiltersLists(recipesList, ingredientsList, appliancesList, ustensilsList);

  return { ingredientsList, appliancesList, ustensilsList };
}

getData();
