class Category {
    static all = [];
    static container = () => contentContainer().querySelector('#categories');
    static dropdown = () => formContainer().querySelector('#cat-dropdown');

    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.selected = false;

        this.button = document.createElement('button');
        this.button.addEventListener('click', this.handleCategoryClick)
        this.option = document.createElement('option');

        Category.all.push(this)
    };

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

    // DOM MANIPULATIONS
    attachButton = () => {
        Category.container().append(this.renderButton());
    };

    attachOption = () => {
        Category.dropdown().append(this.renderOption());
    };

    // EVENT HANDLERS
    handleCategoryClick = () => {
        let filteredCategory
        Category.all.forEach(category => {
            if(category.button === this.button && !this.selected) {
                category.button.classList.add('active');
                category.selected = true;
                filteredCategory = category;
            } else {
                category.button.classList.remove('active');
                category.selected = false;
            };
        });
        Recipe.filterByCategory(filteredCategory);
    };
};
