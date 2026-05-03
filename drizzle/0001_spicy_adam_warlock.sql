ALTER TABLE `ingredients` RENAME COLUMN "price_cents" TO "price_vat_exclusive_cents";--> statement-breakpoint
ALTER TABLE `ingredients` ADD `vat_percentage` real DEFAULT 0 NOT NULL;