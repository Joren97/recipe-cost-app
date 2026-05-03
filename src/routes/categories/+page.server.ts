import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { ingredientCategories, recipeCategories, ingredients, recipes } from '$lib/server/db/schema';

type CategoryType = 'ingredient' | 'recipe';

function getCategoryTable(type: CategoryType) {
    return type === 'ingredient' ? ingredientCategories : recipeCategories;
}

export const load = async () => {
    return {
        ingredientCategories: await db.select().from(ingredientCategories),
        recipeCategories: await db.select().from(recipeCategories)
    };
};

export const actions = {
    create: async ({ request }) => {
        const form = await request.formData();

        const type = String(form.get('type')) as CategoryType;
        const name = String(form.get('name') ?? '').trim();

        if (!name || !['ingredient', 'recipe'].includes(type)) {
            return fail(400, { message: 'Naam en type zijn verplicht.' });
        }

        const table = getCategoryTable(type);

        await db.insert(table).values({ name });

        return { success: true };
    },

    update: async ({ request }) => {
        const form = await request.formData();

        const type = String(form.get('type')) as CategoryType;
        const id = Number(form.get('id'));
        const name = String(form.get('name') ?? '').trim();

        if (!id || !name || !['ingredient', 'recipe'].includes(type)) {
            return fail(400, { message: 'Categorie, naam en type zijn verplicht.' });
        }

        const table = getCategoryTable(type);

        await db.update(table).set({ name }).where(eq(table.id, id));

        return { success: true };
    },

    remove: async ({ request }) => {
        const form = await request.formData();

        const type = String(form.get('type')) as CategoryType;
        const id = Number(form.get('id'));

        if (!id || !['ingredient', 'recipe'].includes(type)) {
            return fail(400, { message: 'Categorie id en type zijn verplicht.' });
        }

        const table = getCategoryTable(type);

        // Check if category is in use before deleting
        const inUse = await db.select()
            .from(type === 'ingredient' ? ingredients : recipes)
            .where(eq(type === 'ingredient' ? ingredients.categoryId : recipes.categoryId, id))
            .limit(1);

        if (inUse.length > 0) {
            return fail(400, { message: 'Deze categorie is nog in gebruik en kan niet worden verwijderd.' });
        }

        await db.delete(table).where(eq(table.id, id));

        return { success: true };
    }
};