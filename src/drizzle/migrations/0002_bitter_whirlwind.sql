ALTER TABLE "transfers" ALTER COLUMN "note" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "transfers" ADD COLUMN "receive_note" varchar DEFAULT '' NOT NULL;