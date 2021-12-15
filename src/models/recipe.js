// Node Getters
const infoContainer = () => contentContainer().querySelector('#info');
const contentIngredients = () => contentContainer().querySelector('#ingredients-list');
const contentInstructions = () => contentContainer().querySelector('#instructions-list');
const formIngredients = () => formContainer().querySelector('#recipe-ingredients');
const formInstructions = () => formContainer().querySelector('#recipe-instructions');
const catDropdown = () => formContainer().querySelector('#cat-dropdown');
const recipesList = () => contentContainer().querySelector('#recipes-list');

// Frontend store (for filter)
let allRecipes = [];

// Renders (Node Constructors, HTML Setters) & Event Listeners
const createRecipeLink = (obj) => {
    const recipeName = obj.attributes.name.split(' (');
    const li = document.createElement('li');
    li.dataset.categoryId = obj.attributes.category_id
    li.innerHTML = `
        <div class="recipe-link">
            <a href id="recipe-${obj.id}">
                ${recipeName[0]}
                <br>
                <span class="reduce-font-size">${recipeName[1].slice(0,-1)}</span>
            </a>
        <div>
    `;
    allRecipes.push(li);
    appendRecipeLink(li);
    const newlyAddedAnchor = contentContainer().querySelector(`#recipe-${obj.id}`);
    newlyAddedAnchor.addEventListener('click', (e) => handleRecipeClick(e, obj.id));
};

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
    addCategoriesToDropdown(categoryOptions);
    catDropdown().selectedIndex = 0
    addEventForExtraFields();

    const form = formContainer().querySelector('#recipe-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        prepFormSubmit('POST');
    });
};

const setReturnLink = () => {
    returnLink.innerText = `Return to Recipes`;
    returnLink.classList.add('return-link');
    returnLink.addEventListener('click', handleReturnClick);
}

const renderRecipe = (obj) => {
    window.scrollTo(0, 0);
    subHeader.remove();
    addRecipeBtn.remove();
    mainHeader().classList.replace('main-header', 'main-header-content');
    buttonContainer().classList.replace('button', 'link');
    buttonContainer().append(returnLink);
    formContainer().innerHTML = ``;
    contentContainer().innerHTML = `
        <div id="info">
        </div>
        <div id="buttons">
            <button class="edit">Edit Recipe</button>
            <button class="delete">Delete Recipe</button>
        </div>
    `;

    populateInfo(obj.attributes);

    const editBtn = contentContainer().querySelector('.edit');
    const deleteBtn = contentContainer().querySelector('.delete');
    editBtn.addEventListener('click', (e) => handleEditOrSave(e, obj.id, obj.attributes.category));
    deleteBtn.addEventListener('click', (e) => deleteRecipe(obj.id));
};

const populateInfo = ({name, description, image, ingredients, instructions}) => {
    infoContainer().innerHTML = `
        <hr>
        <h3 class="name">${name}</h3>
        <p class="description">${description}</p>
        <img class="image" src="${image}" width="300">
        <h4>Ingredients</h4>
            <ul id="ingredients-list">
            </ul>
        <h4>Instructions</h4>
            <ol id="instructions-list">
            </ol>
    `;
    ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.innerText = ingredient;
        contentIngredients().append(li);
    });
    instructions.forEach(instruction => {
        const li = document.createElement('li');
        li.innerText = instruction;
        contentInstructions().append(li);
    });
}

const editRecipeForm = (currentCategory) => {
    window.scrollTo(0, 0);

    const name = contentContainer().querySelector('h3.name')
    const description = contentContainer().querySelector('p.description');
    const image = contentContainer().querySelector('img.image');
    const ingredientsCollection = contentIngredients().children;
    const instructionsCollection = contentInstructions().children;

    let currentName = name.innerText;
    let currentDesc = description.innerText;
    let currentImg = image.src;

    formContainer().innerHTML = `
        <hr>
        <form id="recipe-edit-form">
            <label for="cat-dropdown">Category:</label><br>
            <select id="cat-dropdown">
            </select>
            <br>
            <label for="recipe-name">Name:</label><br>
            <input type="text" id="recipe-name" value="${currentName}"><br>
            <label for="recipe-description">Description:</label><br>
            <textarea id="recipe-description">${currentDesc}</textarea><br>
            <label for="recipe-image">Image URL:</label><br>
            <input type="text" id="recipe-image"value="${currentImg}"><br>
            <label for="recipe-ingredients">Ingredients:</label>
            <ul id="recipe-ingredients">
            </ul>
            <button id="add-ingredient" type="button">+ Add another ingredient</button><br>
            <label for="recipe-instructions">Instructions:</label>
            <ol id="recipe-instructions">
            </ol>
            <button id="add-instruction" type="button">+ Add next step</button><br>
        </form>
    `;
    addCategoriesToDropdown(categoryOptions);
    catDropdown().value = currentCategory.id

    for(const ingredient of ingredientsCollection){
        const currentIngredient = ingredient.innerText;
        formIngredients().innerHTML += `
            <li>
                <textarea>${currentIngredient}</textarea>
            </li>
        `;
    };
    for(const instruction of instructionsCollection){
        const currentInstruction = instruction.innerText;
        formInstructions().innerHTML += `
            <li>
                <textarea>${currentInstruction}</textarea>
            </li>
        `;
    };
    addEventForExtraFields();

    infoContainer().innerHTML = ``;
};

const addEventForExtraFields = () => {
    const addIngredientBtn = formContainer().querySelector('#add-ingredient');
    const addInstructionBtn = formContainer().querySelector('#add-instruction');
    addIngredientBtn.addEventListener('click', addIngredient);
    addInstructionBtn.addEventListener('click', addInstruction);
};

// Append ONLY
const appendRecipeLink = (li) => {
    recipesList().append(li);
};

const addCategoriesToDropdown = (arr) => {
    arr.forEach(option => catDropdown().append(option));
};

// Event Handlers
const addNewRecipe = (e) => {
    if (e.target.innerText === `Add a new recipe`) {
        e.target.innerText = `Hide form`;
        newRecipeForm();
    } else if (e.target.innerText === `Hide form`) {
        e.target.innerText = `Add a new recipe`;
        formContainer().innerHTML = ``;
    };
};

const addIngredient = (e) => {
    const liTag = document.createElement('li');
    const textareaTag = document.createElement('textarea');
    textareaTag.setAttribute('name', 'ingredients[]')
    liTag.append(textareaTag);
    formIngredients().append(liTag);
};

const addInstruction = (e) => {
    const liTag = document.createElement('li');
    const textareaTag = document.createElement('textarea');
    textareaTag.setAttribute('name', 'instructions[]')
    liTag.append(textareaTag);
    formInstructions().append(liTag);
};

const handleRecipeClick = (e, id) => {
    e.preventDefault();
    recipeAdapter.fetchSingleRecipe(id)
};

const handleReturnClick = (e) => {
    resetPage();
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

const prepFormSubmit = (request, id='') => {
    const name = formContainer().querySelector('#recipe-name').value;
    const description = formContainer().querySelector('#recipe-description').value;
    const image = !!formContainer().querySelector('#recipe-image').value ? formContainer().querySelector('#recipe-image').value : "https://blog.nscsports.org/wp-content/uploads/2014/10/default-img.gif";
    const ingredientsCollection = formIngredients().children;
    const instructionsCollection = formInstructions().children;
    const ingredients = [];
    const instructions = [];
    const category_id = catDropdown().value

    for (const li of ingredientsCollection){
        if(li.lastElementChild.value){
            ingredients.push(li.lastElementChild.value);
        };
    };
    for (const li of instructionsCollection){
        if(li.lastElementChild.value){
            instructions.push(li.lastElementChild.value);
        };
    };

    const recipeInfo = {
        name,
        description,
        image,
        ingredients,
        instructions,
        category_id
    };

    recipeAdapter.sendRecipe(request, recipeInfo, id);
};

const deleteRecipe = (id) => {
    if(confirm('Are you sure you want to delete this recipe?')){
        recipeAdapter.deleteRecipe(id);
    };
};
