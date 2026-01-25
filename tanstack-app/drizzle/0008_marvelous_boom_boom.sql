-- 1. Add the column as nullable first to avoid errors with existing data
ALTER TABLE "user_to_course_created" ADD COLUMN "id" text;
ALTER TABLE "user_to_course_taken" ADD COLUMN "id" text;

-- 2. Populate the new 'id' column for all existing rows with unique strings
-- Using gen_random_uuid() is the standard for text-based unique IDs in 2026
UPDATE "user_to_course_created" SET "id" = gen_random_uuid()::text WHERE "id" IS NULL;
UPDATE "user_to_course_taken" SET "id" = gen_random_uuid()::text WHERE "id" IS NULL;

-- 3. Now apply the NOT NULL constraint and PRIMARY KEY
ALTER TABLE "user_to_course_created" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "user_to_course_created" ADD PRIMARY KEY ("id");

ALTER TABLE "user_to_course_taken" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "user_to_course_taken" ADD PRIMARY KEY ("id");
