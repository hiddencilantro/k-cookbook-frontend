class CategoryAdapter {
    constructor(domain){
        this.baseURL = `${domain}/categories`
    };

    getCategories = () => {
        fetch(this.baseURL)
            .then(resp => resp.json())
            .then(json => {
                json.data.forEach(element => {
                    const category = new Category(element.id, element.attributes.name);
                    category.attachButton();
                });
            });
    };
};
