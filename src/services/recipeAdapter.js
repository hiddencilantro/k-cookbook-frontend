class RecipeAdapter {
    constructor(domain){
        this.baseURL = `${domain}/recipes`;
    };

    fetchAllRecipes = () => {
        fetch(this.baseURL)
            .then(resp => resp.json())
            .then(json => {
                json.data.forEach(recipe => addRecipeLink(recipe))
            });
    };

    fetchSingleRecipe = (id) => {
        fetch(`${this.baseURL}/${id}`)
            .then(resp => resp.json())
            .then(json => displayRecipeInfo(json.data));
    };

    deleteRecipe = (id) => {
        const configObj = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            }
        };
        fetch(`${this.baseURL}/${id}`, configObj)
            .then(resp => resp.json())
            .then(() => {
                setPageToDefault();
                this.fetchAllRecipes();
            });
    };

    sendRecipe = (request, recipeInfo, id) => {
        const configObj = {
            method: request,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(recipeInfo)
        };
        fetch(`${this.baseURL}/${id}`, configObj)
            .then(resp => resp.json())
            .then(json => displayRecipeInfo(json.data));
    };
};
