import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import {
    categories,
    ingredients,
    recipes,
    recipeIngredients
} from './schema';

// Create DB connection
const sqlite = new Database('local.db');
const db = drizzle(sqlite);

async function seed() {
    console.log('🌱 Seeding database...');

    // --- Clear existing data (optional but useful for dev) ---
    await db.delete(recipeIngredients);
    await db.delete(recipes);
    await db.delete(ingredients);
    await db.delete(categories);

    // --- Categories ---
    const insertedCategories = await db
        .insert(categories)
        .values([
            { name: 'Flour & grains' },
            { name: 'Dairy' },
            { name: 'Sugar' },
            { name: 'Fruit' },
            { name: 'Chocolate' }
        ])
        .returning();

    const categoryMap = Object.fromEntries(
        insertedCategories.map((c) => [c.name, c.id])
    );

    // --- Ingredients ---
    const insertedIngredients = await db
        .insert(ingredients)
        .values([
            // Flour
            {
                name: 'Flour',
                categoryId: categoryMap['Flour & grains'],
                priceCents: 1000, // €10
                amount: 1000,
                unit: 'g'
            },

            // Sugar
            {
                name: 'Sugar',
                categoryId: categoryMap['Sugar'],
                priceCents: 200,
                amount: 1000,
                unit: 'g'
            },

            // Butter
            {
                name: 'Butter',
                categoryId: categoryMap['Dairy'],
                priceCents: 300,
                amount: 250,
                unit: 'g'
            },

            // Milk
            {
                name: 'Milk',
                categoryId: categoryMap['Dairy'],
                priceCents: 150,
                amount: 1000,
                unit: 'ml'
            },

            // Chocolate
            {
                name: 'Dark Chocolate',
                categoryId: categoryMap['Chocolate'],
                priceCents: 400,
                amount: 200,
                unit: 'g'
            },

            // Strawberries
            {
                name: 'Strawberries',
                categoryId: categoryMap['Fruit'],
                priceCents: 500,
                amount: 500,
                unit: 'g'
            }
        ])
        .returning();

    const ingredientMap = Object.fromEntries(
        insertedIngredients.map((i) => [i.name, i.id])
    );

    // --- Recipes ---
    const insertedRecipes = await db
        .insert(recipes)
        .values([
            { name: 'Pancakes' },
            { name: 'Chocolate Cake' }
        ])
        .returning();

    const recipeMap = Object.fromEntries(
        insertedRecipes.map((r) => [r.name, r.id])
    );

    // --- Recipe Ingredients ---
    await db.insert(recipeIngredients).values([
        // Pancakes
        {
            recipeId: recipeMap['Pancakes'],
            ingredientId: ingredientMap['Flour'],
            amount: 200
        },
        {
            recipeId: recipeMap['Pancakes'],
            ingredientId: ingredientMap['Milk'],
            amount: 300
        },
        {
            recipeId: recipeMap['Pancakes'],
            ingredientId: ingredientMap['Butter'],
            amount: 50
        },

        // Chocolate Cake
        {
            recipeId: recipeMap['Chocolate Cake'],
            ingredientId: ingredientMap['Flour'],
            amount: 250
        },
        {
            recipeId: recipeMap['Chocolate Cake'],
            ingredientId: ingredientMap['Sugar'],
            amount: 150
        },
        {
            recipeId: recipeMap['Chocolate Cake'],
            ingredientId: ingredientMap['Butter'],
            amount: 200
        },
        {
            recipeId: recipeMap['Chocolate Cake'],
            ingredientId: ingredientMap['Dark Chocolate'],
            amount: 150
        }
    ]);

    console.log('✅ Seeding complete!');
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seeding failed');
    console.error(err);
    process.exit(1);
});