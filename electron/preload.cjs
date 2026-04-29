const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    listCategories: () => ipcRenderer.invoke('categories:list'),
    createCategory: (name) => ipcRenderer.invoke('categories:create', name),

    listIngredients: () => ipcRenderer.invoke('ingredients:list'),
    createIngredient: (ingredient) => ipcRenderer.invoke('ingredients:create', ingredient),

    listRecipes: () => ipcRenderer.invoke('recipes:list'),
    getRecipe: (id) => ipcRenderer.invoke('recipes:get', id),
    createRecipe: (recipe) => ipcRenderer.invoke('recipes:create', recipe)
});