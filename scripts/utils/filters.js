import { generateFiltersLists, displayRecipes, lowerCaseNormalize } from "../main.js";
import { searchBar } from "./searchBar.js";

export { init, createFiltersLists, searchOnFiltersList };

function init(recipesList) {
  displayRecipes(recipesList);
  searchBar(recipesList);
  generateFiltersLists(recipesList);
  displayListsInit();
  searchOnFiltersList(recipesList, generateFiltersLists);
  removeTags(recipesList);
}

//// create filter lists from a pattern ////

function createFiltersLists(recipesList, ingredientsList, appliancesList, ustensilsList) {
  const ingredientsContainer = document.querySelector(".ingredients-content");
  ingredientsContainer.innerHTML = "";
  filtersListPattern(ingredientsList, ingredientsContainer);

  const appliancesContainer = document.querySelector(".appliances-content");
  appliancesContainer.innerHTML = "";
  filtersListPattern(appliancesList, appliancesContainer);

  const ustensilsContainer = document.querySelector(".ustensils-content");
  ustensilsContainer.innerHTML = "";
  filtersListPattern(ustensilsList, ustensilsContainer);

  displayTags(recipesList);
}

// pattern

function filtersListPattern(ElementList, ElementListcontent) {
  ElementList.forEach((element) => {
    const createListsDOM = document.createElement("li");
    createListsDOM.innerHTML = element;
    createListsDOM.classList.add("list-item");
    ElementListcontent.appendChild(createListsDOM);
  });
}

//// search algo on filters lists, update filters lists ////

function searchOnFiltersList(recipesList, generateFiltersLists) {
  const filtersItems = generateFiltersLists(recipesList);
  const filtersInput = document.querySelectorAll(".filter-input");

  filtersInput.forEach((input) => {
    input.addEventListener("keyup", function (e) {
      const targetFilter = e.target.className;
      if (targetFilter.includes("ingredients")) {
        const searchInput = lowerCaseNormalize(e.target.value);
        const filteredIngredients = filtersItems.ingredientsList.filter((ingredient) => {
          return lowerCaseNormalize(ingredient).includes(searchInput);
        });

        createFiltersLists(
          recipesList,
          filteredIngredients,
          filtersItems.appliancesList,
          filtersItems.ustensilsList
        );
      }
      if (targetFilter.includes("appliances")) {
        const searchInput = lowerCaseNormalize(e.target.value);
        const filteredAppliances = filtersItems.appliancesList.filter((appliance) => {
          return lowerCaseNormalize(appliance).includes(searchInput);
        });

        createFiltersLists(
          recipesList,
          filtersItems.ingredientsList,
          filteredAppliances,
          filtersItems.ustensilsList
        );
      }
      if (targetFilter.includes("ustensils")) {
        const searchInput = lowerCaseNormalize(e.target.value);
        const filteredUstensils = filtersItems.ustensilsList.filter((ustensil) => {
          return lowerCaseNormalize(ustensil).includes(searchInput);
        });

        createFiltersLists(
          recipesList,
          filtersItems.ingredientsList,
          filtersItems.appliancesList,
          filteredUstensils
        );
      }
    });
  });
}

//// show and close filters lists (one by one) ////

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

//// Create, add, remove tags ////

let tagsArray = [];

// tag pattern

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

// prevent redisplaying the entire array list

function resetTags() {
  document.querySelectorAll(".tag-item").forEach(function (tag) {
    tag.parentElement.removeChild(tag);
  });
}

// create tags from tag pattern

function addTags() {
  resetTags();
  const researchTag = document.querySelector(".research-tag");
  tagsArray.forEach(function (tag) {
    const input = createTag(tag);
    researchTag.appendChild(input);
  });
}

// display tags, launch function to filter recipes display

function displayTags(recipesList) {
  let listItems = document.querySelectorAll(".list-item");
  listItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      const selectItem = e.target.innerHTML;
      if (!tagsArray.includes(selectItem)) {
        tagsArray.push(selectItem);
      }
      addTags();
      displayByTagSearch(recipesList);
    });
  });
}

// remove tags on click

function removeTags(recipesList) {
  document.addEventListener("click", function (e) {
    if (e.target.className === "closebtn") {
      const value = e.target.getAttribute("data-item");
      const index = tagsArray.indexOf(value);
      tagsArray = [...tagsArray.slice(0, index), ...tagsArray.slice(index + 1)];
      addTags();
      displayByTagSearch(recipesList);
    }
  });
}

//// displays the recipes containing the displayed tags ////

function displayByTagSearch(recipesList) {
  const recipesSection = document.getElementById("recipes");
  const tags = document.querySelectorAll(".tag-item");
  const filters = Array.from(tags);
  const filteredFilters = recipesList.filter((recipe) => {
    return filters.every((item) => {
      const formatedItem = lowerCaseNormalize(item.textContent);
      return (
        recipe.ingredients.some((i) => {
          return lowerCaseNormalize(i.ingredient).includes(formatedItem);
        }) ||
        lowerCaseNormalize(recipe.appliance).includes(formatedItem) ||
        recipe.ustensils.some((ustensil) => {
          return lowerCaseNormalize(ustensil) === formatedItem;
        })
      );
    });
  });
  if (filteredFilters.length) {
    recipesSection.innerHTML = "";
    displayRecipes(filteredFilters);
    generateFiltersLists(filteredFilters);
  }
}
