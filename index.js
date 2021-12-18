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

const infoContainer = () => contentContainer().querySelector('#info');
const formIngredients = () => formContainer().querySelector('#recipe-ingredients');
const formInstructions = () => formContainer().querySelector('#recipe-instructions');
const catDropdown = () => formContainer().querySelector('#cat-dropdown');
const categoryContainer = () => contentContainer().querySelector('#categories');
const recipesList = () => contentContainer().querySelector('#recipes-list');

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
    returnLink.addEventListener('click', handleReturnClick);
};

const initExtraFields = () => {
    const addIngredientBtn = formContainer().querySelector('#add-ingredient');
    const addInstructionBtn = formContainer().querySelector('#add-instruction');
    addIngredientBtn.addEventListener('click', handleAddIngredient);
    addInstructionBtn.addEventListener('click', handleAddInstruction);
};

// EVENT HANDLERS
const handleRecipeBtn = (e) => {
    if (e.target.innerText === `Add a new recipe`) {
        e.target.innerText = `Hide form`;
        newRecipeForm();
    } else if (e.target.innerText === `Hide form`) {
        e.target.innerText = `Add a new recipe`;
        formContainer().innerHTML = ``;
    };
};

const handleReturnClick = (e) => {
    resetPage();
    Recipe.all.forEach(recipe => recipe.attachLink());
};

const handleAddIngredient = (e) => {
    const li = document.createElement('li');
    const textarea = document.createElement('textarea');
    textarea.setAttribute('name', 'ingredients[]')
    li.append(textarea);
    formIngredients().append(li);
};

const handleAddInstruction = (e) => {
    const li = document.createElement('li');
    const textarea = document.createElement('textarea');
    textarea.setAttribute('name', 'instructions[]')
    li.append(textarea);
    formInstructions().append(li);
};

// RENDER NEW RECIPE FORM
const newRecipeForm = () => {
    formContainer().innerHTML = `
        <form id="recipe-form">
            <label for="cat-dropdown">Category:</label><br>
            <select id="cat-dropdown">
                <option>Select a category</option>
            </select>
            <br>
            <label for="recipe-name">Name:</label><br>
            <input type="text" id="recipe-name"><br>
            <label for="recipe-description">Description:</label><br>
            <textarea id="recipe-description"></textarea><br>
            <label for="recipe-image">Image URL:</label><br>
            <input type="text" id="recipe-image"><br>
            <label for="recipe-ingredients">Ingredients:</label>
            <ul id="recipe-ingredients">
                <li>
                    <textarea></textarea>
                </li>
            </ul>
            <button id="add-ingredient" type="button">+ Add another ingredient</button><br>
            <label for="recipe-instructions">Instructions:</label>
            <ol id="recipe-instructions">
                <li>
                    <textarea></textarea>
                </li>
            </ol>
            <button id="add-instruction" type="button">+ Add next step</button><br>
            <input type="submit" value="Submit Recipe">
        </form>
    `;
    Category.all.forEach(category => category.attachOption());
    catDropdown().selectedIndex = 0;
    initExtraFields();

    const form = formContainer().querySelector('#recipe-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        recipeAdapter.createRecipe();
    });
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
};
