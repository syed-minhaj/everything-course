CREATE TABLE "chapters" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"title" varchar(255) NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "modules" ADD COLUMN "chapter_id" text;--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chapter_courseId_idx" ON "chapters" USING btree ("course_id");--> statement-breakpoint
ALTER TABLE "modules" ADD CONSTRAINT "modules_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "module_chapterId_idx" ON "modules" USING btree ("chapter_id");