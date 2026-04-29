// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Window {
		api: {
			listCategories: () => Promise<any[]>;
			createCategory: (name: string) => Promise<any>;

			listIngredients: () => Promise<any[]>;
			createIngredient: (ingredient: {
				name: string;
				category_id: number;
				package_amount: number;
				package_unit: string;
				package_price: number;
			}) => Promise<any>;

			listRecipes: () => Promise<any[]>;
			getRecipe: (id: number) => Promise<any>;

			createRecipe: (recipe: {
				name: string;
				description?: string;
				ingredients: {
					ingredient_id: number;
					amount: number;
					unit: string;
				}[];
			}) => Promise<any>;
		};
	}
}

export { };
