CREATE TABLE `recipe_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recipe_categories_name_unique` ON `recipe_categories` (`name`);--> statement-breakpoint
ALTER TABLE `recipes` ADD `category_id` integer NOT NULL REFERENCES recipe_categories(id);