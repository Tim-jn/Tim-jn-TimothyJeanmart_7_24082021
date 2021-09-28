import { generateFiltersLists, displayRecipes, LowerCaseNormalize } from "../main.js";
import { searchBar } from "./searchBar.js";

export { init, createFiltersLists };

function init(recipesList) {
  displayRecipes(recipesList);
  searchBar(recipesList);
  generateFiltersLists(recipesList);
  displayListsInit();
  searchOnFiltersList(recipesList, generateFiltersLists);
  removeTags(recipesList);
}

// generate filters lists

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

function filtersListPattern(ElementList, ElementListcontent) {
  ElementList.forEach((element) => {
    const createListsDOM = document.createElement("li");
    createListsDOM.innerHTML = element;
    createListsDOM.classList.add("list-item");
    ElementListcontent.appendChild(createListsDOM);
  });
}

function searchOnFiltersList(recipesList, generateFiltersLists) {
  const filtersItems = generateFiltersLists(recipesList);
  const filtersInput = document.querySelectorAll(".filter-input");

  filtersInput.forEach((input) => {
    input.addEventListener("keyup", function (e) {
      const targetFilter = e.target.className;
      if (targetFilter.includes("ingredients")) {
        const searchInput = LowerCaseNormalize(e.target.value);
        const filteredIngredients = filtersItems.ingredientsList.filter((ingredient) => {
          return LowerCaseNormalize(ingredient).includes(searchInput);
        });

        createFiltersLists(
          recipesList,
          filteredIngredients,
          filtersItems.appliancesList,
          filtersItems.ustensilsList
        );
      }
      if (targetFilter.includes("appliances")) {
        const searchInput = LowerCaseNormalize(e.target.value);
        const filteredAppliances = filtersItems.appliancesList.filter((appliance) => {
          return LowerCaseNormalize(appliance).includes(searchInput);
        });

        createFiltersLists(
          recipesList,
          filtersItems.ingredientsList,
          filteredAppliances,
          filtersItems.ustensilsList
        );
      }
      if (targetFilter.includes("ustensils")) {
        const searchInput = LowerCaseNormalize(e.target.value);
        const filteredUstensils = filtersItems.ustensilsList.filter((ustensil) => {
          return LowerCaseNormalize(ustensil).includes(searchInput);
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
      displayByTagSearch(recipesList);
    });
  });
}

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

// search on tags

function displayByTagSearch(recipesList) {
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
  }
}
