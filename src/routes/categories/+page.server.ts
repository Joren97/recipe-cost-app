import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { categories } from '$lib/server/db/schema';

export const load = async () => {
    const allCategories = await db.select().from(categories);

    return {
        categories: allCategories
    };
};

export const actions = {
    create: async ({ request }) => {
        const form = await request.formData();
        const name = String(form.get('name') ?? '').trim();

        if (!name) {
            return fail(400, { message: 'Category name is required.' });
        }

        await db.insert(categories).values({ name });

        return { success: true };
    },

    update: async ({ request }) => {
        const form = await request.formData();

        const id = Number(form.get('id'));
        const name = String(form.get('name') ?? '').trim();

        if (!id || !name) {
            return fail(400, { message: 'Category id and name are required.' });
        }

        await db.update(categories).set({ name }).where(eq(categories.id, id));

        return { success: true };
    },

    remove: async ({ request }) => {
        const form = await request.formData();
        const id = Number(form.get('id'));

        if (!id) {
            return fail(400, { message: 'Missing category id.' });
        }

        await db.delete(categories).where(eq(categories.id, id));

        return { success: true };
    }
};