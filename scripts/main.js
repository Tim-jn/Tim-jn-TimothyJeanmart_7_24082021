import { recipes } from "./data/recipes.js";

//// CONSTRUCTOR.JS ////

class RecipesCard {
  constructor(recipes) {
    this.id = recipes.id;
    this.name = recipes.name;
    if (recipes.image) {
      this.image = recipes.image;
    } else {
      this.image = "greyBackground.jpg";
    }
    this.servings = recipes.servings;
    this.ingredients = recipes.ingredients;
    this.time = recipes.time;
    this.description = recipes.description;
    this.appliance = recipes.appliance;
    this.ustensils = recipes.ustensils;
  }

  buildCard() {
    const card = document.createElement("article");
    card.classList.add("recipeCard");
    card.innerHTML = `
            <div class="image"> 
            <img src="./images/recipes-images/${this.image}">
            </div>
            <div class="textContent">
              <div class="textContentUp">
              <h2 class="name">${this.name}</h2>
                <p class="time"><img class="clock" src="./images/clock.svg" alt="time">${
                  this.time
                } min</p>
              </div>
              <div class="textContentDown">
                <ul class="ingredients">
                ${this.ingredients.map(
                  (element) =>
                    `<li><span>${element.ingredient}</span> : ${
                      "quantity" in element ? element.quantity : ""
                    }
                ${"unit" in element ? element.unit : ""}`
                )}</li>
                </ul>
                <p class="description">${this.description}</p>
              </div>
            </div>
          `;
    return card;
  }
}

//// MAIN.JS ////

function getData() {
  const recipesList = data();
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

function init(recipesList) {
  displayRecipes(recipesList);
  searchBar(recipesList);
  generateFiltersLists(recipesList);
  displayListsInit();
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

//// FILTERS.JS ////

function createFiltersLists(ingredientsList, appliancesList, ustensilsList) {
  const ingredientsContainer = document.querySelector(".ingredients-content");
  ingredientsContainer.innerHTML = "";
  filtersListPattern(ingredientsList, ingredientsContainer);

  const appliancesContainer = document.querySelector(".appliances-content");
  appliancesContainer.innerHTML = "";
  filtersListPattern(appliancesList, appliancesContainer);

  const ustensilsContainer = document.querySelector(".ustensils-content");
  ustensilsContainer.innerHTML = "";
  filtersListPattern(ustensilsList, ustensilsContainer);
}

function filtersListPattern(ElementList, ElementListcontent) {
  ElementList.forEach((element) => {
    const createListsDOM = document.createElement("li");
    createListsDOM.innerHTML = element;
    createListsDOM.classList.add("list-item");
    ElementListcontent.appendChild(createListsDOM);
  });
}

// generate filters lists

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

  createFiltersLists(ingredientsList, appliancesList, ustensilsList);
  searchOnFiltersList(recipesList, ingredientsList, appliancesList, ustensilsList);
}

function searchOnFiltersList(recipesList, ingredientsList, appliancesList, ustensilsList) {
  const filtersInput = document.querySelectorAll(".filter-input");

  filtersInput.forEach((input) => {
    input.addEventListener("keyup", function (e) {
      const targetFilter = e.target.className;
      if (targetFilter.includes("ingredients")) {
        console.log(ingredientsList);
        const searchInput = LowerCaseNormalize(e.target.value);
        const filteredIngredients = ingredientsList.filter((ingredient) => {
          return LowerCaseNormalize(ingredient).includes(searchInput);
        });

        createFiltersLists(filteredIngredients, appliancesList, ustensilsList);
        displayTags(recipesList);
      }
      if (targetFilter.includes("appliances")) {
        const searchInput = LowerCaseNormalize(e.target.value);
        const filteredAppliances = appliancesList.filter((appliance) => {
          return LowerCaseNormalize(appliance).includes(searchInput);
        });

        createFiltersLists(ingredientsList, filteredAppliances, ustensilsList);
        displayTags(recipesList);
      }
      if (targetFilter.includes("ustensils")) {
        const searchInput = LowerCaseNormalize(e.target.value);
        const filteredUstensils = ustensilsList.filter((ustensil) => {
          return LowerCaseNormalize(ustensil).includes(searchInput);
        });

        createFiltersLists(ingredientsList, appliancesList, filteredUstensils);
        displayTags(recipesList);
      }
    });
  });
  displayTags(recipesList);
}

//// Event display lists (one by one) ////

function displayLists(obj, objlist, item, targetFilter) {
  if (targetFilter.includes(item) && obj.isFilterOpen == false) {
    for (let o of objlist) {
      o.content.style.display = "none";
      o.input.style.width = "170px";
      o.isFilterOpen = false;
    }

    obj.content.style.display = "grid";
    obj.input.style.width = "710px";
    obj.isFilterOpen = true;
  } else if (targetFilter.includes(item) && obj.isFilterOpen == true) {
    obj.content.style.display = "none";
    obj.input.style.width = "170px";
    obj.isFilterOpen = false;
  }
}

function displayListsInit() {
  const filtersButton = document.querySelectorAll("#filters .filter-button");
  let ingredientobj = {};
  let applianceobj = {};
  let ustensilobj = {};
  ingredientobj.isFilterOpen = false;
  applianceobj.isFilterOpen = false;
  ustensilobj.isFilterOpen = false;

  filtersButton.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const targetFilter = e.target.className;

      ingredientobj.content = document.querySelector(".ingredients-content");
      ingredientobj.input = document.querySelector(".ingredients-input");

      applianceobj.content = document.querySelector(".appliances-content");
      applianceobj.input = document.querySelector(".appliances-input");

      ustensilobj.content = document.querySelector(".ustensils-content");
      ustensilobj.input = document.querySelector(".ustensils-input");

      // Display ingredients list and launch resarch algo (close other lists)

      displayLists(
        ingredientobj,
        [ingredientobj, applianceobj, ustensilobj],
        "ingredients",
        targetFilter
      );

      displayLists(
        applianceobj,
        [ingredientobj, applianceobj, ustensilobj],
        "appliances",
        targetFilter
      );
      displayLists(
        ustensilobj,
        [ingredientobj, applianceobj, ustensilobj],
        "ustensils",
        targetFilter
      );
    });
  });
}

// Create, add, remove, search by tags

let tagsArray = [];

function createTag(item) {
  const tag = document.createElement("div");
  tag.className = "tag-item";
  const text = document.createElement("span");
  text.className = "text";
  text.innerHTML = item;
  const closeBtn = document.createElement("img");
  closeBtn.className = "closebtn";
  closeBtn.src = "./images/close.svg";
  closeBtn.setAttribute("data-item", item);

  tag.appendChild(text);
  tag.appendChild(closeBtn);
  return tag;
}

function resetTags() {
  document.querySelectorAll(".tag-item").forEach(function (tag) {
    tag.parentElement.removeChild(tag);
  });
}

function addTags() {
  resetTags();
  const researchTag = document.querySelector(".research-tag");
  tagsArray.forEach(function (tag) {
    const input = createTag(tag);
    researchTag.appendChild(input);
  });
}

function displayTags(recipesList) {
  let listItems = document.querySelectorAll(".list-item");
  listItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      const selectItem = e.target.innerHTML;
      tagsArray.push(selectItem);
      addTags();
      filtersTagSearch(recipesList);
    });
  });

  //remove tags

  document.addEventListener("click", function (e) {
    if (e.target.className === "closebtn") {
      const value = e.target.getAttribute("data-item");
      const index = tagsArray.indexOf(value);
      tagsArray = [...tagsArray.slice(0, index), ...tagsArray.slice(index + 1)];
      addTags();
      filtersTagSearch(recipesList);
      generateFiltersLists(recipesList);
    }
  });
}

// search on tags

function filtersTagSearch(recipesList) {
  const recipesSection = document.getElementById("recipes");
  const tags = document.querySelectorAll(".tag-item");
  const filters = Array.from(tags);
  const filteredFilters = recipesList.filter((recipe) => {
    return filters.every((item) => {
      const formatedItem = LowerCaseNormalize(item.textContent);
      return (
        recipe.ingredients.some((i) => {
          return LowerCaseNormalize(i.ingredient).includes(formatedItem);
        }) ||
        LowerCaseNormalize(recipe.appliance).includes(formatedItem) ||
        recipe.ustensils.some((ustensil) => {
          return LowerCaseNormalize(ustensil) === formatedItem;
        })
      );
    });
  });
  if (filteredFilters.length) {
    recipesSection.innerHTML = "";
    displayRecipes(filteredFilters);
    generateFiltersLists(filteredFilters);
  } else if (!filteredFilters.length) {
    recipesSection.innerHTML =
      '<div class="missing">Aucune recette ne correspond à votre critère… <br />Vous pouvez chercher « tarte aux pommes », « poisson », etc.</div>';
  }
}

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

getData();
