-- 1. DROP EXISTING CONSTRAINTS
-- We must drop these because they depend on the 'integer' type
ALTER TABLE "modules" DROP CONSTRAINT IF EXISTS "modules_course_id_courses_id_fk";
ALTER TABLE "external_resources" DROP CONSTRAINT IF EXISTS "external_resources_module_id_modules_id_fk";
ALTER TABLE "primary_missions" DROP CONSTRAINT IF EXISTS "primary_missions_module_id_modules_id_fk";
ALTER TABLE "quick_quizzes" DROP CONSTRAINT IF EXISTS "quick_quizzes_module_id_modules_id_fk";

--> statement-breakpoint

-- 2. ALTER COLUMNS WITH CASTING
-- Use 'USING' to convert existing numbers to strings
ALTER TABLE "courses" ALTER COLUMN "id" TYPE text USING "id"::text;
ALTER TABLE "modules" ALTER COLUMN "id" TYPE text USING "id"::text;
ALTER TABLE "modules" ALTER COLUMN "course_id" TYPE text USING "course_id"::text;
ALTER TABLE "external_resources" ALTER COLUMN "id" TYPE text USING "id"::text;
ALTER TABLE "external_resources" ALTER COLUMN "module_id" TYPE text USING "module_id"::text;
ALTER TABLE "primary_missions" ALTER COLUMN "id" TYPE text USING "id"::text;
ALTER TABLE "primary_missions" ALTER COLUMN "module_id" TYPE text USING "module_id"::text;
ALTER TABLE "quick_quizzes" ALTER COLUMN "id" TYPE text USING "id"::text;
ALTER TABLE "quick_quizzes" ALTER COLUMN "module_id" TYPE text USING "module_id"::text;

--> statement-breakpoint

-- 3. RE-ADD CONSTRAINTS
-- Now that both sides are 'text', we can restore the links
ALTER TABLE "modules" ADD CONSTRAINT "modules_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE cascade ON UPDATE cascade;
ALTER TABLE "external_resources" ADD CONSTRAINT "external_resources_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE cascade ON UPDATE cascade;
ALTER TABLE "primary_missions" ADD CONSTRAINT "primary_missions_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE cascade ON UPDATE cascade;
ALTER TABLE "quick_quizzes" ADD CONSTRAINT "quick_quizzes_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE cascade ON UPDATE cascade;
