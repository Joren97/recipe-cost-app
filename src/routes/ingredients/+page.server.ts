// src/routes/ingredients/+page.server.ts
import { db } from '$lib/server/db';
import { categories, ingredients } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async () => {
    const allCategories = await db.select().from(categories);
    const allIngredients = await db
        .select({
            id: ingredients.id,
            name: ingredients.name,
            priceCents: ingredients.priceCents,
            amount: ingredients.amount,
            unit: ingredients.unit,
            categoryId: ingredients.categoryId
        })
        .from(ingredients);

    return {
        categories: allCategories,
        ingredients: allIngredients
    };
};

export const actions = {
    create: async ({ request }) => {
        const form = await request.formData();

        const name = String(form.get('name') ?? '').trim();
        const categoryId = Number(form.get('categoryId'));
        const priceEuro = Number(form.get('priceEuro'));
        const amount = Number(form.get('amount'));
        const unit = String(form.get('unit') ?? '').trim();

        if (!name || !categoryId || !priceEuro || !amount || !unit) {
            return fail(400, { message: 'Missing fields' });
        }

        await db.insert(ingredients).values({
            name,
            categoryId,
            priceCents: Math.round(priceEuro * 100),
            amount,
            unit
        });

        return { success: true };
    }
};