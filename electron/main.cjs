const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./db.cjs');

const isDev = !app.isPackaged;

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    if (isDev) {
        win.loadURL('http://localhost:5173');
    } else {
        win.loadFile(path.join(__dirname, '../build/index.html'));
    }
}

app.whenReady().then(createWindow);

ipcMain.handle('categories:list', () => {
    return db.prepare('SELECT * FROM categories ORDER BY name').all();
});

ipcMain.handle('categories:create', (_event, name) => {
    return db.prepare('INSERT INTO categories (name) VALUES (?)').run(name);
});

ipcMain.handle('ingredients:list', () => {
    return db.prepare(`
    SELECT ingredients.*, categories.name AS category_name
    FROM ingredients
    JOIN categories ON categories.id = ingredients.category_id
    ORDER BY ingredients.name
  `).all();
});

ipcMain.handle('ingredients:create', (_event, ingredient) => {
    const pricePerUnit = ingredient.package_price / ingredient.package_amount;

    return db.prepare(`
    INSERT INTO ingredients
    (name, category_id, package_amount, package_unit, package_price, price_per_unit)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
        ingredient.name,
        ingredient.category_id,
        ingredient.package_amount,
        ingredient.package_unit,
        ingredient.package_price,
        pricePerUnit
    );
});

ipcMain.handle('recipes:create', (_event, recipe) => {
    const transaction = db.transaction(() => {
        const result = db.prepare(`
      INSERT INTO recipes (name, description)
      VALUES (?, ?)
    `).run(recipe.name, recipe.description ?? '');

        const recipeId = result.lastInsertRowid;

        const insertIngredient = db.prepare(`
      INSERT INTO recipe_ingredients
      (recipe_id, ingredient_id, amount, unit)
      VALUES (?, ?, ?, ?)
    `);

        for (const item of recipe.ingredients) {
            insertIngredient.run(recipeId, item.ingredient_id, item.amount, item.unit);
        }

        return recipeId;
    });

    return transaction();
});

ipcMain.handle('recipes:list', () => {
    return db.prepare(`
    SELECT
      recipes.id,
      recipes.name,
      recipes.description,
      COALESCE(SUM(recipe_ingredients.amount * ingredients.price_per_unit), 0) AS total_price
    FROM recipes
    LEFT JOIN recipe_ingredients ON recipe_ingredients.recipe_id = recipes.id
    LEFT JOIN ingredients ON ingredients.id = recipe_ingredients.ingredient_id
    GROUP BY recipes.id
    ORDER BY recipes.name
  `).all();
});

ipcMain.handle('recipes:get', (_event, recipeId) => {
    const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(recipeId);

    const ingredients = db.prepare(`
    SELECT
      recipe_ingredients.*,
      ingredients.name,
      ingredients.price_per_unit,
      recipe_ingredients.amount * ingredients.price_per_unit AS line_price
    FROM recipe_ingredients
    JOIN ingredients ON ingredients.id = recipe_ingredients.ingredient_id
    WHERE recipe_ingredients.recipe_id = ?
  `).all(recipeId);

    const totalPrice = ingredients.reduce((sum, item) => sum + item.line_price, 0);

    return {
        ...recipe,
        ingredients,
        total_price: totalPrice
    };
});