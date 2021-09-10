import { recipes } from "../data/recipes.js";
import { LowerCaseNormalize } from "../main.js";
import { searchBar, searchBarFilter, searchedElements } from "./searchBar.js";
export { generateAndInitLists };

// Create, sort and remove duplicates from lists

function generateAndInitLists(searchBarFilter, searchedElements) {
  const searchInput = document.getElementById("site-search");
  let ingredients = [];
  let appliances = [];
  let ustensils = [];

  recipes.forEach((recipe) => {
    recipe.ingredients.map((element) => ingredients.push(element.ingredient));
    appliances.push(recipe.appliance);
    recipe.ustensils.map((element) => ustensils.push(element));
  });

  searchInput.addEventListener("keyup", (e) => {
    if (searchInput.length >= 3)
    searchBarFilter = true;
    searchedElements.forEach((searchedElement) => {
      searchedElement.ingredients.map((element) => ingredients.push(element.ingredient));
      appliances.push(searchedElements.appliance);
      searchedElement.ustensils.map((element) => ustensils.push(element));
    });
    console.log(searchBarFilter)
  });

  let ingredientsList = [...new Set(ingredients)].sort();
  let appliancesList = [...new Set(appliances)].sort();
  let ustensilsList = [...new Set(ustensils)].sort();

  displayListsInit(ingredientsList, appliancesList, ustensilsList);
}

generateAndInitLists(searchBarFilter, searchedElements);

// Event display lists (one by one)

function displayLists(obj, objlist, item, targetFilter) {
  if (targetFilter.includes(item) && obj.isFilterOpen == false) {
    const itemsContent = document.querySelector(`.${item}-content`);
    const itemsInput = document.querySelector(`.${item}-input`);
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

// Create searched tags

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
        closebtns[i].addEventListener("click", function () {
          this.parentElement.remove();
        });
      }
    });
  });
}

// Research algorithm

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

    if (input.length >= 3) {
      if (listLowerCaseNormalized.length > 0) {
        createLists(listLowerCaseNormalized, itemsContent);
      } else {
        itemsContent.innerHTML = `<li class="missing">Aucun élément ne correspond à votre critère.</li>`;
      }
    } else if (input.length <= 3) {
      createLists(itemsList, itemsContent);
    }
  });
}
