import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import {
    ingredientCategories,
    recipeCategories,
    ingredients,
    recipes,
    recipeIngredients
} from './schema';

const sqlite = new Database('local.db');
const db = drizzle(sqlite);

async function seed() {
    console.log('🌱 Database vullen...');

    await db.delete(recipeIngredients);
    await db.delete(recipes);
    await db.delete(ingredients);
    await db.delete(recipeCategories);
    await db.delete(ingredientCategories);

    const insertedIngredientCategories = await db
        .insert(ingredientCategories)
        .values([
            { name: 'Bloem & granen' },
            { name: 'Zuivel' },
            { name: 'Suiker' },
            { name: 'Fruit' },
            { name: 'Chocolade' },
            { name: 'Eieren' },
            { name: 'Noten & zaden' }
        ])
        .returning();

    const ingredientCategoryMap = Object.fromEntries(
        insertedIngredientCategories.map((category) => [category.name, category.id])
    );

    const insertedRecipeCategories = await db
        .insert(recipeCategories)
        .values([
            { name: 'Ontbijt' },
            { name: 'Gebak' },
            { name: 'Dessert' },
            { name: 'Lunch' }
        ])
        .returning();

    const recipeCategoryMap = Object.fromEntries(
        insertedRecipeCategories.map((category) => [category.name, category.id])
    );

    const insertedIngredients = await db
        .insert(ingredients)
        .values([
            {
                name: 'Bloem',
                categoryId: ingredientCategoryMap['Bloem & granen'],
                priceVatExclusiveCents: 1000,
                vatPercentage: 6,
                amount: 1000,
                unit: 'g'
            },
            {
                name: 'Kristalsuiker',
                categoryId: ingredientCategoryMap['Suiker'],
                priceVatExclusiveCents: 200,
                vatPercentage: 6,
                amount: 1000,
                unit: 'g'
            },
            {
                name: 'Boter',
                categoryId: ingredientCategoryMap['Zuivel'],
                priceVatExclusiveCents: 300,
                vatPercentage: 6,
                amount: 250,
                unit: 'g'
            },
            {
                name: 'Melk',
                categoryId: ingredientCategoryMap['Zuivel'],
                priceVatExclusiveCents: 150,
                vatPercentage: 6,
                amount: 1000,
                unit: 'ml'
            },
            {
                name: 'Pure chocolade',
                categoryId: ingredientCategoryMap['Chocolade'],
                priceVatExclusiveCents: 400,
                vatPercentage: 6,
                amount: 200,
                unit: 'g'
            },
            {
                name: 'Aardbeien',
                categoryId: ingredientCategoryMap['Fruit'],
                priceVatExclusiveCents: 500,
                vatPercentage: 6,
                amount: 500,
                unit: 'g'
            },
            {
                name: 'Eieren',
                categoryId: ingredientCategoryMap['Eieren'],
                priceVatExclusiveCents: 320,
                vatPercentage: 6,
                amount: 12,
                unit: 'piece'
            },
            {
                name: 'Amandelschilfers',
                categoryId: ingredientCategoryMap['Noten & zaden'],
                priceVatExclusiveCents: 450,
                vatPercentage: 6,
                amount: 200,
                unit: 'g'
            }
        ])
        .returning();

    const ingredientMap = Object.fromEntries(
        insertedIngredients.map((ingredient) => [ingredient.name, ingredient.id])
    );

    const insertedRecipes = await db
        .insert(recipes)
        .values([
            {
                name: 'Pannenkoeken',
                categoryId: recipeCategoryMap['Ontbijt']
            },
            {
                name: 'Chocoladetaart',
                categoryId: recipeCategoryMap['Gebak']
            },
            {
                name: 'Aardbeientaart',
                categoryId: recipeCategoryMap['Dessert']
            }
        ])
        .returning();

    const recipeMap = Object.fromEntries(
        insertedRecipes.map((recipe) => [recipe.name, recipe.id])
    );

    await db.insert(recipeIngredients).values([
        {
            recipeId: recipeMap['Pannenkoeken'],
            ingredientId: ingredientMap['Bloem'],
            amount: 200
        },
        {
            recipeId: recipeMap['Pannenkoeken'],
            ingredientId: ingredientMap['Melk'],
            amount: 300
        },
        {
            recipeId: recipeMap['Pannenkoeken'],
            ingredientId: ingredientMap['Eieren'],
            amount: 2
        },
        {
            recipeId: recipeMap['Pannenkoeken'],
            ingredientId: ingredientMap['Boter'],
            amount: 50
        },

        {
            recipeId: recipeMap['Chocoladetaart'],
            ingredientId: ingredientMap['Bloem'],
            amount: 250
        },
        {
            recipeId: recipeMap['Chocoladetaart'],
            ingredientId: ingredientMap['Kristalsuiker'],
            amount: 150
        },
        {
            recipeId: recipeMap['Chocoladetaart'],
            ingredientId: ingredientMap['Boter'],
            amount: 200
        },
        {
            recipeId: recipeMap['Chocoladetaart'],
            ingredientId: ingredientMap['Pure chocolade'],
            amount: 150
        },
        {
            recipeId: recipeMap['Chocoladetaart'],
            ingredientId: ingredientMap['Eieren'],
            amount: 3
        },

        {
            recipeId: recipeMap['Aardbeientaart'],
            ingredientId: ingredientMap['Bloem'],
            amount: 200
        },
        {
            recipeId: recipeMap['Aardbeientaart'],
            ingredientId: ingredientMap['Kristalsuiker'],
            amount: 120
        },
        {
            recipeId: recipeMap['Aardbeientaart'],
            ingredientId: ingredientMap['Boter'],
            amount: 125
        },
        {
            recipeId: recipeMap['Aardbeientaart'],
            ingredientId: ingredientMap['Aardbeien'],
            amount: 300
        },
        {
            recipeId: recipeMap['Aardbeientaart'],
            ingredientId: ingredientMap['Amandelschilfers'],
            amount: 40
        }
    ]);

    console.log('✅ Database gevuld!');
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Vullen van database mislukt');
    console.error(err);
    process.exit(1);
});