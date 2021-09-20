const domain = 'http://localhost:3000/';
const categoryAdapter = new CategoryAdapter(domain);
const recipeAdapter = new RecipeAdapter(domain);

window.addEventListener('DOMContentLoaded', () => {
    categoryAdapter.fetchAllCategories();
    recipeAdapter.fetchAllRecipes();
    addRecipeBtn.addEventListener('click', addNewRecipe);   
});

const headerContainer = document.querySelector('div.header');
const subHeader = document.querySelector('#sub-header');
const buttonContainer = document.querySelector('div.button');
const addRecipeBtn = document.querySelector('#add-recipe');
const formContainer = document.querySelector('div.form');
const contentContainer = document.querySelector('div.content');
const returnLink = document.createElement('a');
returnLink.setAttribute('href', '');
returnLink.innerText = `Return to recipes`;
const categoryButtons = [];
const categoryOptions = [];
let allRecipes = [];

const renderCategories = (obj) => {
    const button = document.createElement('button');
    button.innerText = obj.attributes.name;
    button.addEventListener('click', (e) => handleCategoryClick(e, obj.id));
    categoryButtons.push(button);

    const option = document.createElement('option');
    option.innerText = obj.attributes.name;
    option.value = obj.id;
    categoryOptions.push(option);
};

const handleCategoryClick = (e, id) => {
    const recipesList = contentContainer.querySelector('#recipes-list');
    if (!e.target.classList.contains('active')) {
        for (const button of e.target.parentElement.children) {
            button.classList.remove('active');
        };
        e.target.classList.add('active');
        const filteredRecipes = allRecipes.filter(li => li.categoryId === parseInt(id));
        recipesList.innerHTML = ``;
        filteredRecipes.forEach(recipe => appendRecipeLink(recipe));
    } else {
        e.target.classList.remove('active');
        recipesList.innerHTML = ``;
        allRecipes.forEach(recipe => appendRecipeLink(recipe));
    };
};

const createRecipeLink = (obj) => {
    const li = document.createElement('li');
    li["categoryId"] = obj.attributes.category_id
    li.innerHTML = `
        <a href id="recipe-${obj.id}">${obj.attributes.name}</a>
    `;
    allRecipes.push(li);
    appendRecipeLink(li);
    const newlyAddedAnchor = contentContainer.querySelector(`#recipe-${obj.id}`);
    newlyAddedAnchor.addEventListener('click', (e) => handleRecipeClick(e, obj.id));
};

const appendRecipeLink = (li) => {
    contentContainer.querySelector('#recipes-list').append(li);
};

const handleRecipeClick = (e, id) => {
    e.preventDefault();
    recipeAdapter.fetchSingleRecipe(id);
};

const displayRecipeInfo = (obj) => {
    window.scrollTo(0, 0);
    headerContainer.prepend(returnLink);
    returnLink.addEventListener('click', handleReturnClick);
    const {name, description, image, ingredients, instructions, category} = obj.attributes;
    subHeader.innerText = name;
    headerContainer.append(subHeader);
    addRecipeBtn.remove();
    formContainer.innerHTML = '';

    contentContainer.innerHTML = `
        <div id="info">
            <p class="description">${description}</p>
            <img class="image" src="${image}" width="300">
            <h4>Ingredients</h4>
                <ul id="ingredients-list">
                </ul>
            <h4>Instructions</h4>
                <ol id="instructions-list">
                </ol>
        </div>
        <div id="buttons">
            <button class="edit">Edit Recipe</button>
            <button class="delete">Delete Recipe</button>
        </div>
    `;

    const contentIngredients = contentContainer.querySelector('#ingredients-list');
    const contentInstructions = contentContainer.querySelector('#instructions-list');

    ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.innerText = `${ingredient}`;
        contentIngredients.append(li);
    });
    instructions.forEach(instruction => {
        const li = document.createElement('li');
        li.innerText = `${instruction}`;
        contentInstructions.append(li);
    });

    const editBtn = contentContainer.querySelector('.edit');
    const deleteBtn = contentContainer.querySelector('.delete');
    editBtn.addEventListener('click', (e) => handleEditOrSave(e, obj.id, category));
    deleteBtn.addEventListener('click', (e) => deleteRecipe(e, obj.id));
};

const handleReturnClick = (e) => {
    e.preventDefault();
    setPageToDefault();
    recipeAdapter.fetchAllRecipes();
};

const handleEditOrSave = (e, recipeId, categoryObj) => {
    if (e.target.innerText === `Edit Recipe`) {
        e.target.innerText = `Save Recipe`;
        editRecipeForm(categoryObj);
    } else if (e.target.innerText === `Save Recipe`) {
        e.target.innerText = `Edit Recipe`;
        prepFormSubmit('PATCH', recipeId);
    };
};

const editRecipeForm = (currentCategory) => {
    window.scrollTo(0, 0);
    subHeader.remove();

    const infoContainer = contentContainer.querySelector('#info');
    const description = contentContainer.querySelector('p.description');
    const image = contentContainer.querySelector('img.image');
    const ingredientsCollection = contentContainer.querySelector('#ingredients-list').children;
    const instructionsCollection = contentContainer.querySelector('#instructions-list').children;

    let currentName = subHeader.innerText;
    let currentDesc = description.innerText;
    let currentImg = image.src;

    infoContainer.innerHTML = ``;
    formContainer.innerHTML = `
        <form id="recipe-form">
            <br>
            <label for="cat-dropdown">Category: </label>
            <select name="category_id" id="cat-dropdown">
                <option value="${currentCategory.id}">${currentCategory.name}</option>
            </select>
            <br><br>
            <label for="recipe-name">Name: </label>
            <input type="text" name="name" id="recipe-name" size="35" value="${currentName}"><br><br>
            <label for="recipe-description">Description:</label><br>
            <textarea name="description" id="recipe-description" rows="3" cols="60">${currentDesc}</textarea><br><br>
            <label for="recipe-image">Image URL: </label>
            <input type="text" name="image" id="recipe-image" size="40" value="${currentImg}"><br><br>
            <label for="recipe-ingredients">Ingredients:</label>
            <ul id="recipe-ingredients">
            </ul>
            <button id="add-ingredient">Add another ingredient</button><br><br>
            <label for="recipe-instructions">Instructions:</label>
            <ol id="recipe-instructions">
            </ol>
            <button id="add-instruction">Add next step</button><br><br>
        </form>
    `;
    const remainingCatOptions = categoryOptions.filter(category => category.value != currentCategory.id);
    addCategoriesToDropdown(remainingCatOptions);

    const formIngredients = formContainer.querySelector('#recipe-ingredients');
    const formInstructions = formContainer.querySelector('#recipe-instructions');

    for(const ingredient of ingredientsCollection){
        let currentIngredient = ingredient.innerText;
        formIngredients.innerHTML += `
            <li>
                <textarea name="ingredients[]" rows="1" cols="45">${currentIngredient}</textarea>
            </li>
        `;
    };
    for(const instruction of instructionsCollection){
        let currentInstruction = instruction.innerText;
        formInstructions.innerHTML += `
            <li>
                <br><textarea name="instructions[]" rows="3" cols="60">${currentInstruction}</textarea>
            </li>
        `;
    };
    addEventForExtraFields();
};

const deleteRecipe = (e, id) => {
    if(confirm('Are you sure you want to delete this recipe?')){
        recipeAdapter.deleteRecipe(id);
    };
};

const setPageToDefault = () => {
    returnLink.remove();
    subHeader.innerText = `Your quick-and-easy guide to Korean recipes`;
    headerContainer.append(subHeader);
    addRecipeBtn.innerText = `Add a new recipe`;
    buttonContainer.append(addRecipeBtn);
    formContainer.innerHTML = ``;
    contentContainer.innerHTML = `
        <h4>Filter by Category:</h4>
            <div id="categories">
            </div>
        <h4>All Recipes:</h4>
            <ul id="recipes-list">
            </ul>
    `;
    appendCategoryButtons(categoryButtons);
};

const appendCategoryButtons = (arr) => {
    const categoryContainer = contentContainer.querySelector('#categories');
    arr.forEach(button => {
        button.classList.remove('active');
        categoryContainer.append(button);
    });
};

const addNewRecipe = (e) => {
    if (e.target.innerText === `Add a new recipe`) {
        e.target.innerText = `Hide form`;
        newRecipeForm();
    } else if (e.target.innerText === `Hide form`) {
        e.target.innerText = `Add a new recipe`;
        formContainer.querySelector('#recipe-form').remove();
    };
};

const newRecipeForm = () => {
    formContainer.innerHTML += `
        <form id="recipe-form">
            <br>
            <label for="cat-dropdown">Category: </label>
            <select name="category_id" id="cat-dropdown">
                <option>Select a category</option>
            </select>
            <br><br>
            <label for="recipe-name">Name: </label>
            <input type="text" name="name" id="recipe-name" size="35"><br><br>
            <label for="recipe-description">Description:</label><br>
            <textarea name="description" id="recipe-description" rows="3" cols="60"></textarea><br><br>
            <label for="recipe-image">Image URL: </label>
            <input type="text" name="image" id="recipe-image" size="40"><br><br>
            <label for="recipe-ingredients">Ingredients:</label>
            <ul id="recipe-ingredients">
                <li>
                    <textarea name="ingredients[]" rows="1" cols="45"></textarea>
                </li>
            </ul>
            <button id="add-ingredient">Add another ingredient</button><br><br>
            <label for="recipe-instructions">Instructions:</label>
            <ol id="recipe-instructions">
                <li>
                    <br><textarea name="instructions[]" rows="3" cols="60"></textarea>
                </li>
            </ol>
            <button id="add-instruction">Add next step</button><br><br>
            <input type="submit" value="Submit Recipe">
        </form>
    `;
    addCategoriesToDropdown(categoryOptions);
    addEventForExtraFields();

    const form = formContainer.querySelector('#recipe-form');
    form.addEventListener('submit', createRecipe);
};

const addCategoriesToDropdown = (arr) => {
    const dropdown = formContainer.querySelector('#cat-dropdown');
    arr.forEach(option => dropdown.append(option));
};

const createRecipe = (e) => {
    //How can I prevent losing the data in the form fields if callback returns false
    e.preventDefault();
    prepFormSubmit('POST', '');
};

const addEventForExtraFields = () => {
    const addIngredientBtn = formContainer.querySelector('#add-ingredient');
    const addInstructionBtn = formContainer.querySelector('#add-instruction');
    addIngredientBtn.addEventListener('click', addIngredient);
    addInstructionBtn.addEventListener('click', addInstruction);
};

const addIngredient = (e) => {
    e.preventDefault();
    const formIngredients = formContainer.querySelector('#recipe-ingredients');
    const liTag = document.createElement('li');
    const textareaTag = document.createElement('textarea');
    textareaTag.setAttribute('name', 'ingredients[]')
    textareaTag.setAttribute('rows', '1');
    textareaTag.setAttribute('cols', '45');
    liTag.append(textareaTag);
    formIngredients.append(liTag);
};

const addInstruction = (e) => {
    e.preventDefault();
    const formInstructions = formContainer.querySelector('#recipe-instructions');
    const liTag = document.createElement('li');
    const brTag = document.createElement('br');
    const textareaTag = document.createElement('textarea');
    textareaTag.setAttribute('name', 'instructions[]')
    textareaTag.setAttribute('rows', '3');
    textareaTag.setAttribute('cols', '60');
    liTag.append(brTag, textareaTag);
    formInstructions.append(liTag);
};

const prepFormSubmit = (request, id) => {
    const categoryInput = formContainer.querySelector('#cat-dropdown');
    const nameInput = formContainer.querySelector('#recipe-name');
    const descriptionInput = formContainer.querySelector('#recipe-description');
    const imageInput = formContainer.querySelector('#recipe-image');
    const ingredientsInputCollection = formContainer.querySelector('#recipe-ingredients').children;
    const instructionsInputCollection = formContainer.querySelector('#recipe-instructions').children;
    const ingredientsInput = [];
    const instructionsInput = [];

    for (const li of ingredientsInputCollection){
        if(li.lastElementChild.value){
            ingredientsInput.push(li.lastElementChild.value);
        };
    };
    for (const li of instructionsInputCollection){
        if(li.lastElementChild.value){
            instructionsInput.push(li.lastElementChild.value);
        };
    };

    const recipeInfo = {
        name: nameInput.value,
        description: descriptionInput.value,
        image: imageInput.value,
        ingredients: ingredientsInput,
        instructions: instructionsInput,
        category_id: categoryInput.value
    };

    recipeAdapter.sendRecipe(request, recipeInfo, id);
};
