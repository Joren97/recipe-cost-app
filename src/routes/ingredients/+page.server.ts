import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { categories, ingredients } from '$lib/server/db/schema';

export const load = async () => {
    const allCategories = await db.select().from(categories);
    const allIngredients = await db.select().from(ingredients);

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
            return fail(400, { message: 'Please fill in all fields.' });
        }

        await db.insert(ingredients).values({
            name,
            categoryId,
            priceCents: Math.round(priceEuro * 100),
            amount,
            unit
        });

        return { success: true };
    },

    update: async ({ request }) => {
        const form = await request.formData();

        const id = Number(form.get('id'));
        const name = String(form.get('name') ?? '').trim();
        const categoryId = Number(form.get('categoryId'));
        const priceEuro = Number(form.get('priceEuro'));
        const amount = Number(form.get('amount'));
        const unit = String(form.get('unit') ?? '').trim();

        if (!id || !name || !categoryId || !priceEuro || !amount || !unit) {
            return fail(400, { message: 'Please fill in all fields.' });
        }

        await db
            .update(ingredients)
            .set({
                name,
                categoryId,
                priceCents: Math.round(priceEuro * 100),
                amount,
                unit
            })
            .where(eq(ingredients.id, id));

        return { success: true };
    },

    remove: async ({ request }) => {
        const form = await request.formData();
        const id = Number(form.get('id'));

        if (!id) {
            return fail(400, { message: 'Missing ingredient id.' });
        }

        await db.delete(ingredients).where(eq(ingredients.id, id));

        return { success: true };
    }
};