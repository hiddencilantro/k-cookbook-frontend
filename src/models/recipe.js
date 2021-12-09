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

// Node Constructors, HTML Setters (Renders), Event Listeners
const createRecipeLink = (obj) => {
    const li = document.createElement('li');
    li.categoryId = obj.attributes.category_id
    li.innerHTML = `
        <a href id="recipe-${obj.id}">${obj.attributes.name}</a>
    `;
    allRecipes.push(li);
    appendRecipeLink(li);
    const newlyAddedAnchor = contentContainer().querySelector(`#recipe-${obj.id}`);
    newlyAddedAnchor.addEventListener('click', (e) => handleRecipeClick(e, obj.id));
};

const newRecipeForm = () => {
    formContainer().innerHTML = `
        <form id="recipe-form">
            <br>
            <label for="cat-dropdown">Category: </label>
            <select id="cat-dropdown">
                <option>Select a category</option>
            </select>
            <br><br>
            <label for="recipe-name">Name: </label>
            <input type="text" id="recipe-name" size="35"><br><br>
            <label for="recipe-description">Description:</label><br>
            <textarea id="recipe-description" rows="3" cols="60"></textarea><br><br>
            <label for="recipe-image">Image URL: </label>
            <input type="text" id="recipe-image" size="40"><br><br>
            <label for="recipe-ingredients">Ingredients:</label>
            <ul id="recipe-ingredients">
                <li>
                    <textarea rows="1" cols="45"></textarea>
                </li>
            </ul>
            <button id="add-ingredient">Add another ingredient</button><br><br>
            <label for="recipe-instructions">Instructions:</label>
            <ol id="recipe-instructions">
                <li>
                    <br><textarea rows="3" cols="60"></textarea>
                </li>
            </ol>
            <button id="add-instruction">Add next step</button><br><br>
            <input type="submit" value="Submit Recipe">
        </form>
    `;
    addCategoriesToDropdown(categoryOptions);
    addEventForExtraFields();

    const form = formContainer().querySelector('#recipe-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        prepFormSubmit('POST');
    });
};

const setReturnLink = () => {
    returnLink.setAttribute('href', '');
    returnLink.innerText = `Return to recipes`;
    returnLink.addEventListener('click', handleReturnClick);
}

const renderRecipe = (obj) => {
    addRecipeBtn.remove();
    document.querySelector('#main-header').after(returnLink)
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
    // arrow functions inherit the execution context of their outer function
    // but how does it receive the newly updated obj at the time the callback is executed even without passing the new obj into renderRecipe again (after a PATCH request)
    deleteBtn.addEventListener('click', (e) => deleteRecipe(obj.id));
};

const populateInfo = ({name, description, image, ingredients, instructions}) => {
    window.scrollTo(0, 0);
    formContainer().innerHTML = '';
    subHeader.innerText = name;
    headerContainer().append(subHeader);
    infoContainer().innerHTML = `
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
    subHeader.remove();

    const description = contentContainer().querySelector('p.description');
    const image = contentContainer().querySelector('img.image');
    const ingredientsCollection = contentIngredients().children;
    const instructionsCollection = contentInstructions().children;

    let currentName = subHeader.innerText;
    let currentDesc = description.innerText;
    let currentImg = image.src;

    infoContainer().innerHTML = ``;
    formContainer().innerHTML = `
        <form id="recipe-form">
            <br>
            <label for="cat-dropdown">Category: </label>
            <select id="cat-dropdown">
                <option value="${currentCategory.id}">${currentCategory.name}</option>
            </select>
            <br><br>
            <label for="recipe-name">Name: </label>
            <input type="text" id="recipe-name" size="35" value="${currentName}"><br><br>
            <label for="recipe-description">Description:</label><br>
            <textarea id="recipe-description" rows="3" cols="60">${currentDesc}</textarea><br><br>
            <label for="recipe-image">Image URL: </label>
            <input type="text" id="recipe-image" size="40" value="${currentImg}"><br><br>
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
    const remainingCatOptions = categoryOptions.filter(category => parseInt(category.value) !== currentCategory.id);
    addCategoriesToDropdown(remainingCatOptions);

    for(const ingredient of ingredientsCollection){
        const currentIngredient = ingredient.innerText;
        formIngredients().innerHTML += `
            <li>
                <textarea rows="1" cols="45">${currentIngredient}</textarea>
            </li>
        `;
    };
    for(const instruction of instructionsCollection){
        const currentInstruction = instruction.innerText;
        formInstructions().innerHTML += `
            <li>
                <br><textarea rows="3" cols="60">${currentInstruction}</textarea>
            </li>
        `;
    };
    addEventForExtraFields();
};

const addEventForExtraFields = () => {
    const addIngredientBtn = formContainer().querySelector('#add-ingredient');
    const addInstructionBtn = formContainer().querySelector('#add-instruction');
    addIngredientBtn.addEventListener('click', addIngredient);
    addInstructionBtn.addEventListener('click', addInstruction);
};

const addIngredient = (e) => {
    e.preventDefault();
    const liTag = document.createElement('li');
    const textareaTag = document.createElement('textarea');
    textareaTag.setAttribute('name', 'ingredients[]')
    textareaTag.setAttribute('rows', '1');
    textareaTag.setAttribute('cols', '45');
    liTag.append(textareaTag);
    formIngredients().append(liTag);
};

const addInstruction = (e) => {
    e.preventDefault();
    const liTag = document.createElement('li');
    const brTag = document.createElement('br');
    const textareaTag = document.createElement('textarea');
    textareaTag.setAttribute('name', 'instructions[]')
    textareaTag.setAttribute('rows', '3');
    textareaTag.setAttribute('cols', '60');
    liTag.append(brTag, textareaTag);
    formInstructions().append(liTag);
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

const handleRecipeClick = (e, id) => {
    e.preventDefault();
    recipeAdapter.fetchSingleRecipe(id)
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
