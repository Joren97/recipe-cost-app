// src/lib/server/db/schema.ts
import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

// 🔹 Ingredient categories (renamed)
export const ingredientCategories = sqliteTable('ingredient_categories', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique()
});

// 🔹 Recipe categories
export const recipeCategories = sqliteTable('recipe_categories', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique()
});

// 🔹 Ingredients
export const ingredients = sqliteTable('ingredients', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	categoryId: integer('category_id')
		.notNull()
		.references(() => ingredientCategories.id),
	priceVatExclusiveCents: integer('price_vat_exclusive_cents').notNull(),
	vatPercentage: real('vat_percentage').notNull().default(0),
	amount: real('amount').notNull(),
	unit: text('unit').notNull()
});

// 🔹 Recipes
export const recipes = sqliteTable('recipes', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	categoryId: integer('category_id')
		.notNull()
		.references(() => recipeCategories.id)
});

// 🔹 Recipe ingredients
export const recipeIngredients = sqliteTable('recipe_ingredients', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	recipeId: integer('recipe_id')
		.notNull()
		.references(() => recipes.id),
	ingredientId: integer('ingredient_id')
		.notNull()
		.references(() => ingredients.id),
	amount: real('amount').notNull()
});