import { recipes } from './recipes.js'

class RecipesCard {
  static init () {
    const recipesSection = document.getElementById('recipes')
    recipes.forEach((recipe) => {
      recipesSection.append(new RecipesCard(recipe).buildCard(recipes))
    })
  }

  constructor (id, name, servings, ingredients, time, description, appliance, ustensils) {
    this.id = id
    this.name = name
    this.servings = servings
    this.ingredients = ingredients
    this.time = time
    this.description = description
    this.appliance = appliance
    this.ustensils = ustensils
  }

  buildCard (recipes) {
    const card = document.createElement('article')
    card.classList.add('recipeCard')
    card.innerHTML = `
      <div class="image"></div>
      <div class="textContent">
        <div class="textContentUp">
        <h2 class="name">${recipes.name}</h2>
          <p class="time"><img class="clock" src="./images/clock.svg" alt="time">${recipes.time} min</p>
        </div>
        <div class="textContentDown">
          <p class="ingredients">${recipes.ingredients}</p>
          <p class="description">${recipes.description}</p>
        </div>
      </div>
    `
    return card
  }
}

RecipesCard.init()
