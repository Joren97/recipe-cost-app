// src/routes/recipes/[id]/+page.server.ts
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import {
    ingredients,
    recipeCategories,
    recipeIngredients,
    recipes
} from '$lib/server/db/schema';

function vatPriceCents(priceVatExclusiveCents: number, vatPercentage: number) {
    return Math.round(priceVatExclusiveCents * (vatPercentage / 100));
}

function priceVatInclusiveCents(priceVatExclusiveCents: number, vatPercentage: number) {
    return priceVatExclusiveCents + vatPriceCents(priceVatExclusiveCents, vatPercentage);
}

function calculateLineCostCents(
    recipeAmount: number,
    packageAmount: number,
    priceVatExclusiveCents: number,
    vatPercentage: number
) {
    const inclusivePriceCents = priceVatInclusiveCents(priceVatExclusiveCents, vatPercentage);

    return Math.round((recipeAmount / packageAmount) * inclusivePriceCents);
}

export const load = async ({ params }) => {
    const recipeId = Number(params.id);

    const recipe = await db
        .select({
            id: recipes.id,
            name: recipes.name,
            categoryId: recipes.categoryId,
            categoryName: recipeCategories.name
        })
        .from(recipes)
        .innerJoin(recipeCategories, eq(recipes.categoryId, recipeCategories.id))
        .where(eq(recipes.id, recipeId))
        .get();

    const allIngredients = await db.select().from(ingredients);

    const rows = await db
        .select({
            id: recipeIngredients.id,
            amount: recipeIngredients.amount,
            ingredientId: ingredients.id,
            ingredientName: ingredients.name,
            packageAmount: ingredients.amount,
            unit: ingredients.unit,
            priceVatExclusiveCents: ingredients.priceVatExclusiveCents,
            vatPercentage: ingredients.vatPercentage
        })
        .from(recipeIngredients)
        .innerJoin(ingredients, eq(recipeIngredients.ingredientId, ingredients.id))
        .where(eq(recipeIngredients.recipeId, recipeId));

    const recipeItems = rows.map((row) => ({
        ...row,
        vatPriceCents: vatPriceCents(row.priceVatExclusiveCents, row.vatPercentage),
        priceVatInclusiveCents: priceVatInclusiveCents(
            row.priceVatExclusiveCents,
            row.vatPercentage
        ),
        lineCostCents: calculateLineCostCents(
            row.amount,
            row.packageAmount,
            row.priceVatExclusiveCents,
            row.vatPercentage
        )
    }));

    const totalCents = recipeItems.reduce((sum, item) => sum + item.lineCostCents, 0);

    return {
        recipe,
        ingredients: allIngredients,
        recipeItems,
        totalCents
    };
};

export const actions = {
    addIngredient: async ({ request, params }) => {
        const recipeId = Number(params.id);
        const form = await request.formData();

        const ingredientId = Number(form.get('ingredientId'));
        const amount = Number(form.get('amount'));

        if (!recipeId || !ingredientId || !amount) {
            return fail(400, { message: 'Ingrediënt of hoeveelheid ontbreekt.' });
        }

        await db.insert(recipeIngredients).values({
            recipeId,
            ingredientId,
            amount
        });

        return { success: true };
    },

    removeIngredient: async ({ request }) => {
        const form = await request.formData();
        const id = Number(form.get('id'));

        if (!id) {
            return fail(400, { message: 'Receptingrediënt id ontbreekt.' });
        }

        await db.delete(recipeIngredients).where(eq(recipeIngredients.id, id));

        return { success: true };
    }
};