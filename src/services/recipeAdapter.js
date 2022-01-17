class RecipeAdapter {
    constructor(domain){
        this.baseURL = `${domain}/recipes`;
    };

    static setDataObj = () => {
        const ingredientsCollection = Recipe.ingredients().children;
        const instructionsCollection = Recipe.instructions().children;
        const ingredients = [];
        const instructions = [];
        for (const li of ingredientsCollection){
            if(li.firstElementChild.value){
                ingredients.push(li.firstElementChild.value);
            };
        };
        for (const li of instructionsCollection){
            if(li.firstElementChild.value){
                instructions.push(li.firstElementChild.value);
            };
        };
        const dataObj = {
            recipe: {
                name: formContainer().querySelector('#recipe-name').value,
                eng_name: formContainer().querySelector('#recipe-eng-name').value,
                description: formContainer().querySelector('#recipe-description').value,
                image: !!formContainer().querySelector('#recipe-image').value ? formContainer().querySelector('#recipe-image').value : "https://blog.nscsports.org/wp-content/uploads/2014/10/default-img.gif",
                ingredients: ingredients,
                instructions: instructions,
                category_id: Category.dropdown().value === 'new' ? '' : Category.dropdown().value,
                category_attributes: !!formContainer().querySelector('#cat-new') ? {name: formContainer().querySelector('#cat-new').value} : {name: ''}
        }};
        return dataObj;
    };
    static setInitObj = (method) => {
        const initObj = {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(RecipeAdapter.setDataObj())
        };
        return initObj;
    };

    createRecipe = () => {
        fetch(this.baseURL, RecipeAdapter.setInitObj('POST'))
            .then(resp => resp.json())
            .then(json => {
                if(json.error){
                    throw new Error(json.error)
                };
                const recipe = new Recipe({id: json.data.id, ...json.data.attributes});
                if(!!Category.all.find(category => parseInt(category.id) === json.data.attributes.category_id)){
                    const category = Category.all.find(category => parseInt(category.id) === json.data.attributes.category_id);
                    category.recipes.push(recipe);
                    recipe.category = category;
                } else {
                    const category = new Category(json.included[0].id, json.included[0].attributes.name, [recipe]);
                    recipe.category = category;
                };
                recipe.attachShow();
            })
            .catch(error => alert(error));
    };

    updateRecipe = (id) => {
        fetch(`${this.baseURL}/${id}`, RecipeAdapter.setInitObj('PATCH'))
            .then(resp => resp.json())
            .then(json => {
                if(json.error){
                    throw new Error(json.error)
                };
                Recipe.all = Recipe.all.map(recipe => {
                    if(recipe.id === json.data.id) {
                        const updatedRecipe = new Recipe({id: json.data.id, ...json.data.attributes});
                        if(json.data.attributes.category_id !== parseInt(recipe.category.id)) {
                            const newCategory = Category.all.find(category => parseInt(category.id) === json.data.attributes.category_id);
                            newCategory.recipes.push(updatedRecipe);
                            updatedRecipe.category = newCategory;
                            const oldCategory = recipe.category;
                            oldCategory.recipes = oldCategory.recipes.filter(existing => existing !== recipe);
                        } else {
                            const category = recipe.category;
                            updatedRecipe.category = category;
                            const idx = category.recipes.indexOf(recipe);
                            category.recipes[idx] = updatedRecipe;
                        };
                        updatedRecipe.attachShow();
                        return updatedRecipe;
                    };
                    return recipe;
                });
            })
            .catch(error => alert(error));
    };

    deleteRecipe = (id) => {
        fetch(`${this.baseURL}/${id}`, {method: 'DELETE'})
            .then(() => {
                const recipe = Recipe.all.find(recipe => recipe.id === id);
                Recipe.all = Recipe.all.filter(existing => existing !== recipe);
                const category = recipe.category;
                category.recipes = category.recipes.filter(existing => existing !== recipe);
                resetPage();
                Recipe.all.sort(alphabetically).forEach(recipe => recipe.attachLink());
                // alert("Recipe was successfully deleted")
            });
    };
};
