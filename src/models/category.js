class Category {
    static all = [];

    constructor(id, name, recipes) {
        this.id = id;
        this.name = name;
        this.recipes = recipes;
        this.selected = false;

        this.button = document.createElement('button');
        this.button.addEventListener('click', this.handleCategoryButton);
        this.option = document.createElement('option');

        Category.all.push(this)
    };

    // NODE GETTERS
    static container = () => contentContainer().querySelector('#categories');
    static dropdown = () => formContainer().querySelector('#cat-dropdown');

    // RENDERS
    renderButton = () => {
        this.button.innerText = this.name;
        this.button.classList.add('category-buttons');
        return this.button;
    };
    
    renderOption = () => {
        this.option.innerText = this.name;
        this.option.value = this.id;
        return this.option;
    };

    static renderNewOption = () => {
        const option = document.createElement('option');
        option.innerText = `--- CREATE A NEW CATEGORY ---`;
        option.value = `new`;
        return option;
    }

    // DOM MANIPULATIONS
    attachButton = () => {
        Category.container().append(this.renderButton());
    };

    attachOption = () => {
        Category.dropdown().append(this.renderOption());
    };

    // EVENT HANDLERS
    handleCategoryButton = () => {
        Recipe.list().innerHTML = ``;

        if(!this.selected) {
            this.button.classList.add('active');
            this.selected = true;
            this.recipes.forEach(recipe => Recipe.selectedRecipes.push(recipe));
        } else if(this.selected) {
            this.button.classList.remove('active');
            this.selected = false;
            this.recipes.forEach(recipe => {
                Recipe.selectedRecipes = Recipe.selectedRecipes.filter(existing => existing !== recipe)
            });
        };
        Recipe.selectedRecipes.sort(alphabetically).forEach(recipe => recipe.attachLink());

        if(!Category.all.some(category => category.selected === true)){
            Recipe.all.sort(alphabetically).forEach(recipe => recipe.attachLink());
        };
    };
};
