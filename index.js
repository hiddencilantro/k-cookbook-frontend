window.addEventListener('DOMContentLoaded', () => {
    fetchAllRecipes();
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

let fetchAllRecipes = () => {
    fetch('http://localhost:3000/recipes')
        .then(resp => resp.json())
        .then(renderRecipes);
};

let renderRecipes = (json) => {
    const recipes = json.data;
    recipes.forEach(recipe => renderRecipe(recipe));
};

let renderRecipe = (obj) => {
    const recipesList = contentContainer.querySelector('#recipes-list');
    const li = document.createElement('li');
    li.innerHTML = `
        <a href id="recipe-${obj.id}">${obj.attributes.name}</a>
    `;
    recipesList.append(li);
    const newlyAddedAnchor = recipesList.querySelector(`#recipe-${obj.id}`);
    newlyAddedAnchor.addEventListener('click', (e) => handleRecipeClick(e, obj.id));
};

let handleRecipeClick = (e, id) => {
    e.preventDefault();
    
    fetch(`http://localhost:3000/recipes/${id}`)
        .then(resp => resp.json())
        .then(json => displayRecipeInfo(json.data));
};

let displayRecipeInfo = (obj) => {
    window.scrollTo(0, 0);
    headerContainer.prepend(returnLink);
    returnLink.addEventListener('click', handleReturnClick);
    subHeader.innerText = obj.attributes.name;
    headerContainer.append(subHeader);
    addRecipeBtn.remove();
    formContainer.innerHTML = '';

    contentContainer.innerHTML = `
        <div id="info">
            <p class="description">${obj.attributes.description}</p>
            <img class="image" src="${obj.attributes.image}" width="300">
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
    const ingredientsArray = obj.attributes.ingredients;
    const instructionsArray = obj.attributes.instructions;

    ingredientsArray.forEach(ingredient => {
        const li = document.createElement('li');
        li.innerText = `${ingredient}`;
        contentIngredients.append(li);
    });
    instructionsArray.forEach(instruction => {
        const li = document.createElement('li');
        li.innerText = `${instruction}`;
        contentInstructions.append(li);
    });

    const editBtn = contentContainer.querySelector('.edit');
    const deleteBtn = contentContainer.querySelector('.delete');

    editBtn.addEventListener('click', (e) => handleEditOrSave(e, obj.id));
    deleteBtn.addEventListener('click', (e) => deleteRecipe(e, obj.id));
};

let handleReturnClick = (e) => {
    e.preventDefault();
    e.target.remove();
    subHeader.innerText = `Your quick-and-easy guide to Korean recipes`;
    headerContainer.append(subHeader);
    addRecipeBtn.innerText = `Add a new recipe`;
    buttonContainer.append(addRecipeBtn);
    formContainer.innerHTML = ``;
    contentContainer.innerHTML = `
        <ul id="recipes-list">
        </ul>
    `;
    fetch('http://localhost:3000/recipes')
        .then(resp => resp.json())
        .then(renderRecipes);
};

let handleEditOrSave = (e, id) => {
    if (e.target.innerText === `Edit Recipe`) {
        e.target.innerText = `Save Recipe`;
        editRecipeForm();
    } else if (e.target.innerText === `Save Recipe`) {
        e.target.innerText = `Edit Recipe`;
        updateRecipe(id);
    };
};

let editRecipeForm = () => {
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

    const addIngredientBtn = formContainer.querySelector('#add-ingredient');
    const addInstructionBtn = formContainer.querySelector('#add-instruction');
    addIngredientBtn.addEventListener('click', addIngredient);
    addInstructionBtn.addEventListener('click', addInstruction);
};

let updateRecipe = (id) => {
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
        instructions: instructionsInput
    };
    const configObj = {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(recipeInfo)
    };
    fetch(`http://localhost:3000/recipes/${id}`, configObj)
        .then(resp => resp.json())
        .then(json => displayRecipeInfo(json.data));
};

let deleteRecipe = (e, id) => {
    if(confirm('Are you sure you want to delete this recipe?')){
        returnLink.remove();
        subHeader.innerText = `Your quick-and-easy guide to Korean recipes`;
        headerContainer.append(subHeader)
        addRecipeBtn.innerText = `Add a new recipe`;
        buttonContainer.append(addRecipeBtn);
        formContainer.innerHTML = ``;
        contentContainer.innerHTML = `
            <ul id="recipes-list">
            </ul>
        `;
    
        const configObj = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            }
        };
        fetch(`http://localhost:3000/recipes/${id}`, configObj)
            .then(resp => resp.json())
            .then(json => {
                alert(json.message);
                fetch('http://localhost:3000/recipes')
                    .then(resp => resp.json())
                    .then(renderRecipes);
            });
    };
};

let addNewRecipe = (e) => {
    if (e.target.innerText === `Add a new recipe`) {
        e.target.innerText = `Hide form`;
        newRecipeForm();
    } else if (e.target.innerText === `Hide form`) {
        e.target.innerText = `Add a new recipe`;
        formContainer.querySelector('#recipe-form').remove();
    };
};

let newRecipeForm = () => {
    formContainer.innerHTML += `
        <form id="recipe-form">
            <br>
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

    const addIngredientBtn = formContainer.querySelector('#add-ingredient');
    const addInstructionBtn = formContainer.querySelector('#add-instruction');
    addIngredientBtn.addEventListener('click', addIngredient);
    addInstructionBtn.addEventListener('click', addInstruction);

    const form = formContainer.querySelector('#recipe-form');
    form.addEventListener('submit', createRecipe);
};

let createRecipe = (e) => {
    //How can I prevent losing the data in the form fields if callback returns false
    e.preventDefault();

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
        instructions: instructionsInput
    };
    const configObj = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(recipeInfo)
    };
    fetch("http://localhost:3000/recipes", configObj)
        .then(resp => resp.json())
        .then(json => displayRecipeInfo(json.data));
};

let addIngredient = (e) => {
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

let addInstruction = (e) => {
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
