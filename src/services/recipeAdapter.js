class RecipeAdapter {
    constructor(domain){
        this.baseURL = `${domain}/recipes`;
    };

    static headers = {
        "Content-Type": "application/json",
        Accept: "application/json"
    };

    getRecipes = () => {
        fetch(this.baseURL)
            .then(resp => resp.json())
            .then(json => {
                json.data.forEach(element => {
                    const recipe = new Recipe({id: element.id, ...element.attributes});
                    recipe.attachLink();
                });
            });
    };

    createRecipe = () => {
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
            name: formContainer().querySelector('#recipe-name').value,
            eng_name: formContainer().querySelector('#recipe-eng-name').value,
            description: formContainer().querySelector('#recipe-description').value,
            image: !!formContainer().querySelector('#recipe-image').value ? formContainer().querySelector('#recipe-image').value : "https://blog.nscsports.org/wp-content/uploads/2014/10/default-img.gif",
            ingredients: ingredients,
            instructions: instructions,
            category_id: Category.dropdown().value
        };

        const initObj = {
            method: 'POST',
            headers: RecipeAdapter.headers,
            body: JSON.stringify(formData)
        };

        fetch(this.baseURL, initObj)
            .then(resp => resp.json())
            .then(json => {
                if(json.error){
                    throw new Error(json.error)
                };
                const recipe = new Recipe({id: json.data.id, ...json.data.attributes});
                recipe.attachShow();
            })
            .catch(error => alert(error));
    };

    updateRecipe = (formData) => {
        const dataObj = {...formData};
        delete dataObj.id

        const initObj = {
            method: 'PATCH',
            headers: RecipeAdapter.headers,
            body: JSON.stringify(dataObj)
        };

        fetch(`${this.baseURL}/${formData.id}`, initObj)
            .then(resp => resp.json())
            .then(json => {
                if(json.error){
                    throw new Error(json.error)
                };
                Recipe.all = Recipe.all.map(recipe => {
                    if(recipe.id === json.data.id) {
                        const updatedRecipe = new Recipe({id: json.data.id, ...json.data.attributes});
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
                Recipe.all = Recipe.all.filter(recipe => recipe.id !== id)
                resetPage();
                Recipe.all.forEach(recipe => recipe.attachLink())
                // alert("Recipe was successfully deleted")
            });
    };
};
