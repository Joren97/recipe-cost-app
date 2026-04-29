// src/lib/server/db/schema.ts
import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique()
});

export const ingredients = sqliteTable('ingredients', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	categoryId: integer('category_id')
		.notNull()
		.references(() => categories.id),
	priceCents: integer('price_cents').notNull(),
	amount: real('amount').notNull(),
	unit: text('unit').notNull()
});

export const recipes = sqliteTable('recipes', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull()
});

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