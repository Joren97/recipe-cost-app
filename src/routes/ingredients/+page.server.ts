import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { ingredientCategories, ingredients } from '$lib/server/db/schema';

export const load = async () => {
    const allCategories = await db.select().from(ingredientCategories);
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
        const amount = Number(form.get('amount'));
        const unit = String(form.get('unit') ?? '').trim();
        const priceVatExclusiveEuro = Number(form.get('priceVatExclusiveEuro'));
        const vatPercentage = Number(form.get('vatPercentage'));

        if (!name || !categoryId || Number.isNaN(priceVatExclusiveEuro) || Number.isNaN(vatPercentage) || !amount || !unit) {
            return fail(400, { message: 'Vul alle velden in.' });
        }

        await db.insert(ingredients).values({
            name,
            categoryId,
            priceVatExclusiveCents: Math.round(priceVatExclusiveEuro * 100),
            vatPercentage,
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
        const amount = Number(form.get('amount'));
        const unit = String(form.get('unit') ?? '').trim();
        const priceVatExclusiveEuro = Number(form.get('priceVatExclusiveEuro'));
        const vatPercentage = Number(form.get('vatPercentage'));

        if (!name || !categoryId || Number.isNaN(priceVatExclusiveEuro) || Number.isNaN(vatPercentage) || !amount || !unit) {
            return fail(400, { message: 'Vul alle velden in.' });
        }

        await db
            .update(ingredients)
            .set({
                name,
                categoryId,
                priceVatExclusiveCents: Math.round(priceVatExclusiveEuro * 100),
                vatPercentage,
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