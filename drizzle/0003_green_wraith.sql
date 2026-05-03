ALTER TABLE `categories` RENAME TO `ingredient_categories`;--> statement-breakpoint
DROP INDEX `categories_name_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `ingredient_categories_name_unique` ON `ingredient_categories` (`name`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ingredients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`category_id` integer NOT NULL,
	`price_vat_exclusive_cents` integer NOT NULL,
	`vat_percentage` real DEFAULT 0 NOT NULL,
	`amount` real NOT NULL,
	`unit` text NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `ingredient_categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_ingredients`("id", "name", "category_id", "price_vat_exclusive_cents", "vat_percentage", "amount", "unit") SELECT "id", "name", "category_id", "price_vat_exclusive_cents", "vat_percentage", "amount", "unit" FROM `ingredients`;--> statement-breakpoint
DROP TABLE `ingredients`;--> statement-breakpoint
ALTER TABLE `__new_ingredients` RENAME TO `ingredients`;--> statement-breakpoint
PRAGMA foreign_keys=ON;