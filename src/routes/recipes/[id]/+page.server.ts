// src/routes/recipes/[id]/+page.server.ts
import { db } from '$lib/server/db';
import {
    recipes,
    ingredients,
    recipeIngredients
} from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

function calculateLineCostCents(recipeAmount: number, packageAmount: number, priceCents: number) {
    return Math.round((recipeAmount / packageAmount) * priceCents);
}

export const load = async ({ params }) => {
    const recipeId = Number(params.id);

    const recipe = await db.query.recipes.findFirst({
        where: eq(recipes.id, recipeId)
    });

    const allIngredients = await db.select().from(ingredients);

    const rows = await db
        .select({
            id: recipeIngredients.id,
            amount: recipeIngredients.amount,
            ingredientId: ingredients.id,
            ingredientName: ingredients.name,
            packageAmount: ingredients.amount,
            unit: ingredients.unit,
            priceCents: ingredients.priceCents
        })
        .from(recipeIngredients)
        .innerJoin(ingredients, eq(recipeIngredients.ingredientId, ingredients.id))
        .where(eq(recipeIngredients.recipeId, recipeId));

    const recipeItems = rows.map((row) => ({
        ...row,
        lineCostCents: calculateLineCostCents(
            row.amount,
            row.packageAmount,
            row.priceCents
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
            return fail(400, { message: 'Missing ingredient or amount' });
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
            return fail(400, { message: 'Missing recipe ingredient id' });
        }

        await db.delete(recipeIngredients).where(eq(recipeIngredients.id, id));

        return { success: true };
    }
};