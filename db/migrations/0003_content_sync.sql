CREATE TABLE `app_alerts` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`module` text,
	`severity` text DEFAULT 'info',
	`starts_at` text,
	`ends_at` text,
	`source_name` text,
	`source_url` text,
	`dismissed` integer DEFAULT false,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `content_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`content_type` text NOT NULL,
	`version` text NOT NULL,
	`source_name` text,
	`source_url` text,
	`checksum` text,
	`applied_at` text DEFAULT (CURRENT_TIMESTAMP),
	`status` text DEFAULT 'active',
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `media_assets` (
	`id` text PRIMARY KEY NOT NULL,
	`module` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`title` text,
	`remote_url` text,
	`local_uri` text,
	`mime_type` text,
	`checksum` text,
	`size_bytes` integer,
	`last_synced_at` text,
	`offline_available` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `sync_manifest` (
	`id` text PRIMARY KEY NOT NULL,
	`module` text NOT NULL,
	`remote_url` text NOT NULL,
	`local_version` text,
	`remote_version` text,
	`checksum` text,
	`enabled` integer DEFAULT true,
	`last_checked_at` text,
	`last_synced_at` text,
	`notes` text
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_media_assets_entity` ON `media_assets` (`entity_type`, `entity_id`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_sync_manifest_module` ON `sync_manifest` (`module`);
--> statement-breakpoint
INSERT OR IGNORE INTO `content_versions` (`id`, `content_type`, `version`, `source_name`, `notes`) VALUES
	('core-schema', 'system', '1.0.0', 'Clinical OS', 'Base offline clinical schema'),
	('legal-import-pipeline', 'system', '1.0.0', 'Clinical OS', 'Use only licensed, public-domain, or original curated content. Do not import proprietary subscription databases.');
--> statement-breakpoint
INSERT OR IGNORE INTO `sync_manifest` (`id`, `module`, `remote_url`, `local_version`, `enabled`, `notes`) VALUES
	('gp-protocols', 'gp', 'https://example.com/clinical-os/gp-manifest.json', '1.0.0', false, 'Replace with your owned or licensed GP protocol feed.'),
	('dims-drugs', 'dims', 'https://example.com/clinical-os/drug-manifest.json', '1.0.0', false, 'Replace with a legal Bangladeshi drug formulary feed.'),
	('media-assets', 'media', 'https://example.com/clinical-os/media-manifest.json', '1.0.0', false, 'Replace with licensed ECG/CXR/diagram assets.');
