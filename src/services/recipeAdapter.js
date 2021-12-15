class RecipeAdapter {
    constructor(domain){
        this.baseURL = `${domain}/recipes`;
    };

    fetchAllRecipes = () => {
        fetch(this.baseURL)
            .then(resp => resp.json())
            .then(json => {
                allRecipes = [];
                json.data.forEach(recipe => createRecipeLink(recipe));
            });
    };

    fetchSingleRecipe = (id) => {
        fetch(`${this.baseURL}/${id}`)
            .then(resp => resp.json())
            .then(json => renderRecipe(json.data));
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
            .then(json => {
                if(json.error){
                    throw new Error(json.error)
                }
                if(!id) {
                    createRecipeLink(json.data);
                }
                renderRecipe(json.data);
            })
            .catch(error => alert(error));
    };

    deleteRecipe = (id) => {
        const configObj = {
            method: 'DELETE'
        };
        fetch(`${this.baseURL}/${id}`, configObj)
            .then(() => {
                resetPage();
                this.fetchAllRecipes();
            });
    };
};
