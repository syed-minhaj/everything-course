CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_title" varchar(255) NOT NULL,
	"intro_summary" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "external_resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"module_id" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "modules" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"conceptual_deep_dive" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "primary_missions" (
	"id" serial PRIMARY KEY NOT NULL,
	"module_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"instructions" text NOT NULL,
	"rubric" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quick_quizzes" (
	"id" serial PRIMARY KEY NOT NULL,
	"module_id" integer NOT NULL,
	"question" text NOT NULL,
	"options" jsonb NOT NULL,
	"answer" varchar(10) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "external_resources" ADD CONSTRAINT "external_resources_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "modules" ADD CONSTRAINT "modules_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "primary_missions" ADD CONSTRAINT "primary_missions_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quick_quizzes" ADD CONSTRAINT "quick_quizzes_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE no action ON UPDATE no action;