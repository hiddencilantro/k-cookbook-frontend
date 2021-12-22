// INITIALIZATION
const domain = 'http://localhost:3001';
const categoryAdapter = new CategoryAdapter(domain);
const recipeAdapter = new RecipeAdapter(domain);

// NODE GETTERS
const headerContainer = () => document.querySelector('div.header')
const buttonContainer = () => document.querySelector('#button-container');
const formContainer = () => document.querySelector('div.form');
const contentContainer = () => document.querySelector('div.content');

const mainHeader = () => document.querySelector('#main-header')
const subHeader = document.querySelector('#sub-header');
const recipeBtn = document.querySelector('#recipe-button');
const returnLink = document.createElement('button');

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    categoryAdapter.getCategories();
    recipeAdapter.getRecipes();
    initRecipeBtn();
    initReturnLink();
});

// EVENT LISTENERS
const initRecipeBtn = () => {
    recipeBtn.addEventListener('click', handleRecipeBtn);
};

const initReturnLink = () => {
    returnLink.innerText = `Return to Recipes`;
    returnLink.classList.add('return-link');
    returnLink.addEventListener('click', handleReturnLink);
};

// EVENT HANDLERS
const handleRecipeBtn = (e) => {
    if (e.target.innerText === `Add a new recipe`) {
        e.target.innerText = `Hide form`;
        Recipe.newRecipe();
    } else if (e.target.innerText === `Hide form`) {
        e.target.innerText = `Add a new recipe`;
        formContainer().innerHTML = ``;
    };
};

const handleReturnLink = (e) => {
    resetPage();
    Recipe.all.forEach(recipe => recipe.attachLink());
};

// SET PAGE TO DEFAULT
const resetPage = () => {
    window.scrollTo(0, 0);
    returnLink.remove();
    mainHeader().classList.replace('main-header-content', 'main-header');
    headerContainer().append(subHeader);
    recipeBtn.innerText = `Add a new recipe`;
    buttonContainer().classList.add('button');
    buttonContainer().append(recipeBtn);
    formContainer().innerHTML = ``;
    contentContainer().innerHTML = `
        <hr>
        <h4 id="category-header">View by Category:</h4>
        <div id="categories"></div>
        <h4 id="recipe-header">Available Recipes:</h4>
        <ul id="recipes-list"></ul>
    `;
    Category.all.forEach(category => {
        category.button.classList.remove('active');
        category.selected = false;
        category.attachButton();
    });
    Category.filteredCategories = [];
};
