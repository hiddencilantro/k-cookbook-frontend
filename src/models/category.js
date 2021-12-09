// Front-end store (after initial fetch)
const categoryButtons = [];
const categoryOptions = [];

// Node Constructors & Event Listeners
const createCategoryElements = (obj) => {
    const button = document.createElement('button');
    button.innerText = obj.attributes.name;
    button.addEventListener('click', (e) => handleCategoryClick(e, obj.id));
    categoryButtons.push(button);

    const option = document.createElement('option');
    option.innerText = obj.attributes.name;
    option.value = obj.id;
    categoryOptions.push(option);
};

// Append
const appendCategoryButtons = (arr) => {
    const categoryContainer = contentContainer().querySelector('#categories');
    arr.forEach(button => {
        button.classList.remove('active');
        categoryContainer.append(button);
    });
};

// Event Handlers
const handleCategoryClick = (e, id) => {
    if (!e.target.classList.contains('active')) {
        for (const button of e.target.parentElement.children) {
            button.classList.remove('active');
        };
        e.target.classList.add('active');
        const filteredRecipes = allRecipes.filter(recipe => recipe.categoryId === parseInt(id));
        recipesList().innerHTML = ``;
        filteredRecipes.forEach(recipe => appendRecipeLink(recipe));
    } else {
        e.target.classList.remove('active');
        recipesList().innerHTML = ``;
        allRecipes.forEach(recipe => appendRecipeLink(recipe));
    };
};
