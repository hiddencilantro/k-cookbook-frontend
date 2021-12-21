class Recipe {
    static all = [];
    
    constructor({id, name, eng_name, description, image, ingredients, instructions, category_id}) {
        this.id = id;
        this.name = name;
        this.engName = eng_name ? eng_name : "";
        this.description = description;
        this.image = image;
        this.ingredients = ingredients;
        this.instructions = instructions;
        this.categoryId = category_id;

        this.link = document.createElement('div');
        this.link.addEventListener('click', this.handleRecipeClick);
        this.info = document.createElement('div');
        this.buttons = document.createElement('div');
        this.buttons.edit = document.createElement('button');
        this.buttons.edit.addEventListener('click', this.handleEditOrSave);
        this.buttons.delete = document.createElement('button');
        this.buttons.delete.addEventListener('click', this.handleDelete);

        Recipe.all.push(this);
    };

    // NODE GETTERS
    static list = () => contentContainer().querySelector('#recipes-list');
    static ingredients = () => formContainer().querySelector('#recipe-ingredients');
    static instructions = () => formContainer().querySelector('#recipe-instructions');

    // RENDERS
    renderLink = () => {
        this.link.classList.add('recipe-link-div');
        this.link.innerHTML = `
            <span class="recipe-link">
                ${this.name}
                <br>
                <span class="reduce-font-size">${this.engName}</span>
            </span>
        `;
        return this.link;
    };

    renderInfo = () => {
        this.info.id = 'info';
        this.info.innerHTML = `
            <hr>
            <h3 class="name">${this.name} ${this.engName ? "(" + this.engName + ")" : this.engName}</h3>
            <p class="description">${this.description}</p>
            <img class="image" src="${this.image}" width="300">
            <h4>Ingredients</h4>
                <ul id="ingredients-list">
                </ul>
            <h4>Instructions</h4>
                <ol id="instructions-list">
                </ol>
        `;
        const ingredientsList = this.info.querySelector('#ingredients-list');
        const instructionsList = this.info.querySelector('#instructions-list');
        this.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.innerText = ingredient;
            ingredientsList.append(li);
        });
        this.instructions.forEach(instruction => {
            const li = document.createElement('li');
            li.innerText = instruction;
            instructionsList.append(li);
        });
        return this.info;
    };

    renderButtons = () => {
        this.buttons.id = 'buttons';
        this.buttons.edit.classList.add('edit');
        this.buttons.edit.innerText = 'Edit Recipe';
        this.buttons.delete.classList.add('delete');
        this.buttons.delete.innerText = 'Delete Recipe';
        this.buttons.append(this.buttons.edit, this.buttons.delete);
        return this.buttons;
    };

    // DOM MANIPULATIONS
    attachLink = () => {
        Recipe.list().append(this.renderLink());
    };
    
    setPageForShow = () => {
        window.scrollTo(0, 0);
        subHeader.remove();
        recipeBtn.remove();
        mainHeader().classList.replace('main-header', 'main-header-content');
        buttonContainer().classList.remove('button');
        buttonContainer().append(returnLink);
        formContainer().innerHTML = ``;
        contentContainer().innerHTML = ``;
    };
    
    attachShow = () => {
        this.setPageForShow();
        contentContainer().append(this.renderInfo(), this.renderButtons());
    };

    static newRecipe = () => {
        formContainer().innerHTML = `
            <form id="recipe-form">
                <label for="cat-dropdown">Category:</label><br>
                <select id="cat-dropdown">
                    <option>Select a category</option>
                </select>
                <br>
                <label for="recipe-name">Recipe Name:</label><br>
                <input type="text" id="recipe-name">
                <input type="text" id="recipe-eng-name" placeholder="English Translation (optional)"><br>
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
        Category.dropdown().selectedIndex = 0;
        Recipe.initExtraFields();
    
        const form = formContainer().querySelector('#recipe-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            recipeAdapter.createRecipe();
        });
    };

    editRecipe = () => {
        window.scrollTo(0, 0);
        formContainer().innerHTML = `
            <hr>
            <form id="recipe-edit-form">
                <label for="cat-dropdown">Category:</label><br>
                <select id="cat-dropdown">
                </select>
                <br>
                <label for="recipe-name">Recipe Name:</label><br>
                <input type="text" id="recipe-name" value="${this.name}">
                <input type="text" id="recipe-eng-name" placeholder="English Translation (optional)" value="${this.engName}"><br>
                <label for="recipe-description">Description:</label><br>
                <textarea id="recipe-description">${this.description}</textarea><br>
                <label for="recipe-image">Image URL:</label><br>
                <input type="text" id="recipe-image"value="${this.image}"><br>
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
        this.ingredients.forEach(ingredient => {
            Recipe.ingredients().innerHTML += `
                <li>
                    <textarea>${ingredient}</textarea>
                </li>
            `;
        });
        this.instructions.forEach(instruction => {
            Recipe.instructions().innerHTML += `
                <li>
                    <textarea>${instruction}</textarea>
                </li>
            `;
        });
        Category.all.forEach(category => category.attachOption());
        Category.dropdown().value = this.categoryId;
        Recipe.initExtraFields();

        this.info.remove();
    };

    updateRecipe = () => {
        const ingredientsCollection = Recipe.ingredients().children;
        const instructionsCollection = Recipe.instructions().children;
        const ingredients = [];
        const instructions = [];
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

        const formData = {
            id: this.id,
            name: formContainer().querySelector('#recipe-name').value,
            eng_name: formContainer().querySelector('#recipe-eng-name').value,
            description: formContainer().querySelector('#recipe-description').value,
            image: !!formContainer().querySelector('#recipe-image').value ? formContainer().querySelector('#recipe-image').value : "https://blog.nscsports.org/wp-content/uploads/2014/10/default-img.gif",
            ingredients: ingredients,
            instructions: instructions,
            category_id: Category.dropdown().value
        };

        recipeAdapter.updateRecipe(formData);
    };

    // EVENT HANDLERS
    static handleAddIngredient = (e) => {
        const li = document.createElement('li');
        const textarea = document.createElement('textarea');
        textarea.setAttribute('name', 'ingredients[]')
        li.append(textarea);
        Recipe.ingredients().append(li);
    };
    
    static handleAddInstruction = (e) => {
        const li = document.createElement('li');
        const textarea = document.createElement('textarea');
        textarea.setAttribute('name', 'instructions[]')
        li.append(textarea);
        Recipe.instructions().append(li);
    };

    handleRecipeClick = (e) => {
        this.attachShow();
    };

    handleEditOrSave = (e) => {
        if (e.target.innerText === `Edit Recipe`) {
            e.target.innerText = `Save Recipe`;
            this.editRecipe();
        } else if (e.target.innerText === `Save Recipe`) {
            e.target.innerText = `Edit Recipe`;
            this.updateRecipe();
        };
    };

    handleDelete = (e) => {
        if(confirm('Are you sure you want to delete this recipe?')){
            recipeAdapter.deleteRecipe(this.id);
        }; 
    };

    // MISC
    static initExtraFields = () => {
        const addIngredientBtn = formContainer().querySelector('#add-ingredient');
        const addInstructionBtn = formContainer().querySelector('#add-instruction');
        addIngredientBtn.addEventListener('click', Recipe.handleAddIngredient);
        addInstructionBtn.addEventListener('click', Recipe.handleAddInstruction);
    };

    static filterByCategory(category) {
        if(category) {
            const filteredResults = Recipe.all.filter(recipe => recipe.categoryId === parseInt(category.id));
            Recipe.list().innerHTML = ``;
            filteredResults.forEach(recipe => recipe.attachLink());
        } else {
            Recipe.list().innerHTML = ``;
            Recipe.all.forEach(recipe => recipe.attachLink());
        };
    };
};
