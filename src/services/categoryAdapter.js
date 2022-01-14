class CategoryAdapter {
    constructor(domain){
        this.baseURL = `${domain}/categories`
    };

    getAllData = () => {
        fetch(this.baseURL)
            .then(resp => resp.json())
            .then(json => {
                json.data.forEach(catObj => {
                    const associatedRecipeObjects = json.included.filter(recipeObj => recipeObj.attributes.category_id === parseInt(catObj.id));
                    const associatedRecipeInstances = associatedRecipeObjects.map(obj => new Recipe({id: obj.id, ...obj.attributes}));
                    const category = new Category(catObj.id, catObj.attributes.name, associatedRecipeInstances);
                    associatedRecipeInstances.forEach(recipe => recipe.category = category);
                    category.attachButton();
                });
                Recipe.all.sort(alphabetically).forEach(recipe => recipe.attachLink())
            });
    };
};
