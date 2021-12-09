// Intialization
const domain = 'http://localhost:3000';
const categoryAdapter = new CategoryAdapter(domain);
const recipeAdapter = new RecipeAdapter(domain);

// Node Getters
const headerContainer = () => document.querySelector('div.header')
const buttonContainer = () => document.querySelector('div.button');
const formContainer = () => document.querySelector('div.form');
const contentContainer = () => document.querySelector('div.content');
const subHeader = document.querySelector('#sub-header');
const addRecipeBtn = document.querySelector('#add-recipe');
const returnLink = document.createElement('a');

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    categoryAdapter.fetchAllCategories();
    recipeAdapter.fetchAllRecipes();
    addRecipeBtn.addEventListener('click', addNewRecipe);
    setReturnLink();
});

// Reset
const setPageToDefault = () => {
    returnLink.remove();
    subHeader.innerText = `Your quick-and-easy guide to Korean recipes`;
    headerContainer().append(subHeader)
    addRecipeBtn.innerText = `Add a new recipe`
    buttonContainer().append(addRecipeBtn);
    formContainer().innerHTML = ``;
    contentContainer().innerHTML = `
        <h4>Filter by Category:</h4>
        <div id="categories"></div>
        <h4>All Recipes:</h4>
        <ul id="recipes-list"></ul>
    `;
    appendCategoryButtons(categoryButtons);
};
