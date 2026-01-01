-- 1. DROP EXISTING CONSTRAINTS
-- Dropping Foreign Keys first to allow data type changes on the referenced columns
ALTER TABLE "modules" DROP CONSTRAINT IF EXISTS "modules_course_id_courses_id_fk";
ALTER TABLE "external_resources" DROP CONSTRAINT IF EXISTS "external_resources_module_id_modules_id_fk";
ALTER TABLE "primary_missions" DROP CONSTRAINT IF EXISTS "primary_missions_module_id_modules_id_fk";
ALTER TABLE "quick_quizzes" DROP CONSTRAINT IF EXISTS "quick_quizzes_module_id_modules_id_fk";

--> statement-breakpoint

-- 2. ALTER COLUMNS WITH CASTING
-- Converting Primary Keys and Foreign Keys from INT to TEXT
-- 'courses' table
ALTER TABLE "courses" ALTER COLUMN "id" TYPE text USING "id"::text;

-- 'modules' table
ALTER TABLE "modules" ALTER COLUMN "id" TYPE text USING "id"::text;
ALTER TABLE "modules" ALTER COLUMN "course_id" TYPE text USING "course_id"::text;

-- 'external_resources' table
ALTER TABLE "external_resources" ALTER COLUMN "id" TYPE text USING "id"::text;
ALTER TABLE "external_resources" ALTER COLUMN "module_id" TYPE text USING "module_id"::text;

-- 'primary_missions' table
ALTER TABLE "primary_missions" ALTER COLUMN "id" TYPE text USING "id"::text;
ALTER TABLE "primary_missions" ALTER COLUMN "module_id" TYPE text USING "module_id"::text;

-- 'quick_quizzes' table
ALTER TABLE "quick_quizzes" ALTER COLUMN "id" TYPE text USING "id"::text;
ALTER TABLE "quick_quizzes" ALTER COLUMN "module_id" TYPE text USING "module_id"::text;

--> statement-breakpoint

-- 3. RE-ADD CONSTRAINTS
-- Restoring the Foreign Key relationships now that all types match
ALTER TABLE "modules" 
    ADD CONSTRAINT "modules_course_id_courses_id_fk" 
    FOREIGN KEY ("course_id") REFERENCES "courses"("id") 
    ON DELETE cascade ON UPDATE cascade;

ALTER TABLE "external_resources" 
    ADD CONSTRAINT "external_resources_module_id_modules_id_fk" 
    FOREIGN KEY ("module_id") REFERENCES "modules"("id") 
    ON DELETE cascade ON UPDATE cascade;

ALTER TABLE "primary_missions" 
    ADD CONSTRAINT "primary_missions_module_id_modules_id_fk" 
    FOREIGN KEY ("module_id") REFERENCES "modules"("id") 
    ON DELETE cascade ON UPDATE cascade;

ALTER TABLE "quick_quizzes" 
    ADD CONSTRAINT "quick_quizzes_module_id_modules_id_fk" 
    FOREIGN KEY ("module_id") REFERENCES "modules"("id") 
    ON DELETE cascade ON UPDATE cascade;