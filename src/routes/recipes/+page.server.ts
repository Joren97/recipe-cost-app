import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { recipeCategories, recipeIngredients, recipes } from '$lib/server/db/schema';

export const load = async () => {
    return {
        recipes: await db
            .select({
                id: recipes.id,
                name: recipes.name,
                categoryId: recipes.categoryId,
                categoryName: recipeCategories.name
            })
            .from(recipes)
            .innerJoin(recipeCategories, eq(recipes.categoryId, recipeCategories.id)),

        recipeCategories: await db.select().from(recipeCategories)
    };
};

export const actions = {
    create: async ({ request }) => {
        const form = await request.formData();

        const name = String(form.get('name') ?? '').trim();
        const categoryId = Number(form.get('categoryId'));

        if (!name || !categoryId) {
            return fail(400, { message: 'Naam en categorie zijn verplicht.' });
        }

        const result = await db
            .insert(recipes)
            .values({
                name,
                categoryId
            })
            .returning();

        throw redirect(303, `/recipes/${result[0].id}`);
    },

    update: async ({ request }) => {
        const form = await request.formData();

        const id = Number(form.get('id'));
        const name = String(form.get('name') ?? '').trim();
        const categoryId = Number(form.get('categoryId'));

        if (!id || !name || !categoryId) {
            return fail(400, { message: 'Recept, naam en categorie zijn verplicht.' });
        }

        await db
            .update(recipes)
            .set({
                name,
                categoryId
            })
            .where(eq(recipes.id, id));

        return { success: true };
    },

    remove: async ({ request }) => {
        const form = await request.formData();
        const id = Number(form.get('id'));

        if (!id) {
            return fail(400, { message: 'Recept id ontbreekt.' });
        }

        await db.delete(recipeIngredients).where(eq(recipeIngredients.recipeId, id));
        await db.delete(recipes).where(eq(recipes.id, id));

        return { success: true };
    }
};