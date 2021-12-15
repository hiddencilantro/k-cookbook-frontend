// Intialization
const domain = 'http://localhost:3001';
const categoryAdapter = new CategoryAdapter(domain);
const recipeAdapter = new RecipeAdapter(domain);

// Node Getters
const headerContainer = () => document.querySelector('div.header')
const buttonContainer = () => document.querySelector('#button-container');
const formContainer = () => document.querySelector('div.form');
const contentContainer = () => document.querySelector('div.content');
const mainHeader = () => document.querySelector('#main-header')
const subHeader = document.querySelector('#sub-header');
const addRecipeBtn = document.querySelector('#add-recipe');
const returnLink = document.createElement('button');

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    categoryAdapter.fetchAllCategories();
    recipeAdapter.fetchAllRecipes();
    addRecipeBtn.addEventListener('click', addNewRecipe);
    setReturnLink();
});

// Reset to default
const resetPage = () => {
    returnLink.remove();
    mainHeader().classList.replace('main-header-content', 'main-header');
    headerContainer().append(subHeader);
    addRecipeBtn.innerText = `Add a new recipe`;
    buttonContainer().classList.replace('link', 'button');
    buttonContainer().append(addRecipeBtn);
    formContainer().innerHTML = ``;
    contentContainer().innerHTML = `
        <hr>
        <h4 id="category-header">View by Category:</h4>
        <div id="categories"></div>
        <h4 id="recipe-header">Available Recipes:</h4>
        <ul id="recipes-list"></ul>
    `;
    appendCategoryButtons(categoryButtons);
};
