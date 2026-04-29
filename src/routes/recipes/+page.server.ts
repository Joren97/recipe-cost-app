// src/routes/recipes/+page.server.ts
import { db } from '$lib/server/db';
import { recipes } from '$lib/server/db/schema';
import { redirect, fail } from '@sveltejs/kit';

export const load = async () => {
    return {
        recipes: await db.select().from(recipes)
    };
};

export const actions = {
    create: async ({ request }) => {
        const form = await request.formData();
        const name = String(form.get('name') ?? '').trim();

        if (!name) {
            return fail(400, { message: 'Recipe name is required' });
        }

        const result = await db.insert(recipes).values({ name }).returning();

        throw redirect(303, `/recipes/${result[0].id}`);
    }
};