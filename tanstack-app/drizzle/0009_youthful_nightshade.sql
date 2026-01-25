-- 1. Add the columns as nullable
ALTER TABLE "user_to_primary_missions_passed" ADD COLUMN "id" text;
ALTER TABLE "user_to_quick_quizzes_passed" ADD COLUMN "id" text;

-- 2. Populate existing rows with unique random IDs
-- Note: gen_random_uuid() is built-in for Postgres 13+ (2026 standard)
UPDATE "user_to_primary_missions_passed" SET "id" = gen_random_uuid()::text WHERE "id" IS NULL;
UPDATE "user_to_quick_quizzes_passed" SET "id" = gen_random_uuid()::text WHERE "id" IS NULL;

-- 3. Set NOT NULL and define as PRIMARY KEY
ALTER TABLE "user_to_primary_missions_passed" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "user_to_primary_missions_passed" ADD PRIMARY KEY ("id");

ALTER TABLE "user_to_quick_quizzes_passed" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "user_to_quick_quizzes_passed" ADD PRIMARY KEY ("id");
