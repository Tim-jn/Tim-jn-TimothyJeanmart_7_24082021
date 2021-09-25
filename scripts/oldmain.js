import { recipes } from "./data/recipes.js";

//// Create recipies cards ////

// fct start search
// const recipeslist = search()
// displayrecipeslist(recipesList)

// function search
// let recipes list avec toutes les recettes dedans
// recipes list = searchbar research(recipeslist)
// recipes list = searchbytagIngredients(recipeslist)
// recipes list = searchbytagUstensils(recipeslist)
// recipes list = searchbytagAppliance(recipeslist)
// return recipesList

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

//// init and create recipies cards ////

function init() {
  displayRecipies(recipes);
  filterSearchedItems(recipes);
}

init();

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

function filterSearchedItems(recipes) {
  generateLists(recipes);
  const searchInput = document.getElementById("site-search");
  const recipesSection = document.getElementById("recipes");

  // listen search bar input
  searchInput.addEventListener("keyup", (e) => {
    const input = e.target.value.toLowerCase();
    // get filtered recipes object
    const filteredRecipies = recipes.filter((recipe) => {
      const recipeIngredients = recipe.ingredients.map((element) => element.ingredient).toString();
      return (
        LowerCaseNormalize(recipe.name).includes(input) ||
        LowerCaseNormalize(recipeIngredients).includes(input) ||
        LowerCaseNormalize(recipe.description).includes(input)
      );
    });

    recipesSection.innerHTML = "";

    // displays recipes under conditions
    if (input.length >= 3) {
      if (filteredRecipies.length > 0) {
        displayRecipies(filteredRecipies);
        generateLists(filteredRecipies);
      } else {
        recipesSection.innerHTML =
          '<div class="missing">Aucune recette ne correspond à votre critère… <br />Vous pouvez chercher « tarte aux pommes », « poisson », etc.</div>';
        displayRecipies(filteredRecipies);
        generateLists(filteredRecipies);
      }
    } else if (input.length < 3) {
      displayRecipies(recipes);
      generateLists(recipes);
    }
  });
}

//// Create, sort and remove duplicates from lists ////

function generateLists(items) {
  let ingredients = [];
  let appliances = [];
  let ustensils = [];

  items.forEach((item) => {
    item.ingredients.map((element) => ingredients.push(element.ingredient));
    appliances.push(item.appliance);
    item.ustensils.map((element) => ustensils.push(element));
  });

  let ingredientsList = [...new Set(ingredients)].sort();
  let appliancesList = [...new Set(appliances)].sort();
  let ustensilsList = [...new Set(ustensils)].sort();

  displayListsInit(ingredientsList, appliancesList, ustensilsList);
}

//// Event display lists (one by one) ////

function displayLists(obj, objlist, item, targetFilter) {
  if (targetFilter.includes(item) && obj.isFilterOpen == false) {
    const itemsContent = document.querySelector(`.${item}-content`);
    const itemsInput = document.querySelector(`.${item}-input`);
    itemsContent.innerHTML = "";
    searchItems(obj.list, itemsContent, itemsInput);

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

function displayListsInit(ingredientsList, appliancesList, ustensilsList) {
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
      ingredientobj.list = ingredientsList;

      applianceobj.content = document.querySelector(".appliances-content");
      applianceobj.input = document.querySelector(".appliances-input");
      applianceobj.list = appliancesList;

      ustensilobj.content = document.querySelector(".ustensils-content");
      ustensilobj.input = document.querySelector(".ustensils-input");
      ustensilobj.list = ustensilsList;

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

// Create DOM lists

function createLists(ElementList, ElementListcontent) {
  ElementList.forEach((element) => {
    const createListsDOM = document.createElement("li");
    createListsDOM.innerHTML = element;
    createListsDOM.classList.add("list-item");
    ElementListcontent.appendChild(createListsDOM);
  });
}

//// Create searched tags ////

// tag pattern constructor

function tagConstructor(item) {
  this.item = item;

  const researchTag = document.querySelector(".research-tag");
  const tag = document.createElement("div");
  tag.className = "tag-item";
  tag.innerHTML = `
      <span class="text">${item}</span>
      <img class="closebtn" src="./images/close.svg">
      `;
  researchTag.appendChild(tag);
}

// create and delete tags

function displayTag() {
  const listLowerCaseNormalized = document.querySelectorAll("#filters ul li.list-item");

  listLowerCaseNormalized.forEach((listItem) => {
    listItem.addEventListener("click", (e) => {
      const selectItem = e.target.innerHTML;
      new tagConstructor(selectItem);
      const tags = document.getElementsByClassName("tag-item");
      const closebtns = document.getElementsByClassName("closebtn");

      for (let i = 0; i < tags.length; i++) {
        tags[i].style.display = "inline-flex";
        tagsArray.push(tags[i]);
        closebtns[i].addEventListener("click", function () {
          this.parentElement.remove();
          tagsArray.pop(tags[i]);
        });
      }
    });
  });
}

// Research algorithm

let tagsArray = [];

function searchItems(itemsList, itemsContent, itemsInput) {
  itemsContent.innerHTML = "";
  createLists(itemsList, itemsContent);
  displayTag();

  // listen filter input, remove maj and accents

  itemsInput.addEventListener("keyup", (e) => {
    itemsContent.innerHTML = "";
    const input = e.target.value.toLowerCase();
    const listLowerCaseNormalized = itemsList.filter((items) => {
      return LowerCaseNormalize(items).includes(input);
    });

    if (listLowerCaseNormalized.length > 0) {
      createLists(listLowerCaseNormalized, itemsContent);
      displayTag();
    } else {
      itemsContent.innerHTML = `<li class="missing">Aucun élément ne correspond à votre critère.</li>`;
    }
  });
}

function startSearch() {
  const recipesList = search();
  displayRecipesList(recipesList);
}

function search() {
  let recipesList = recipes;
  recipesList = searchBarResearch(recipesList);
  console.log(recipesList);
  recipesList = searchByTagIngredients(recipesList);
  console.log(recipesList);
  /*recipesList = searchByTagUstensils(recipesList);
  recipesList = searchByTagAppliances(recipesList);*/
  return recipesList;
}
