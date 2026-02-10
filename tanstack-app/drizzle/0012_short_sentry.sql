ALTER TABLE "external_resources" DROP CONSTRAINT "external_resources_module_id_modules_id_fk";
--> statement-breakpoint
ALTER TABLE "modules" DROP CONSTRAINT "modules_course_id_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "primary_missions" DROP CONSTRAINT "primary_missions_module_id_modules_id_fk";
--> statement-breakpoint
ALTER TABLE "quick_quizzes" DROP CONSTRAINT "quick_quizzes_module_id_modules_id_fk";
--> statement-breakpoint
ALTER TABLE "user_to_primary_missions_passed" DROP CONSTRAINT "user_to_primary_missions_passed_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_to_primary_missions_passed" DROP CONSTRAINT "user_to_primary_missions_passed_primary_mission_id_primary_missions_id_fk";
--> statement-breakpoint
ALTER TABLE "user_to_quick_quizzes_passed" DROP CONSTRAINT "user_to_quick_quizzes_passed_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_to_quick_quizzes_passed" DROP CONSTRAINT "user_to_quick_quizzes_passed_quick_quiz_id_quick_quizzes_id_fk";
--> statement-breakpoint
ALTER TABLE "user_to_course_taken" DROP CONSTRAINT "user_to_course_taken_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_to_course_taken" DROP CONSTRAINT "user_to_course_taken_course_id_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "external_resources" ADD CONSTRAINT "external_resources_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "modules" ADD CONSTRAINT "modules_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "primary_missions" ADD CONSTRAINT "primary_missions_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quick_quizzes" ADD CONSTRAINT "quick_quizzes_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_primary_missions_passed" ADD CONSTRAINT "user_to_primary_missions_passed_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_primary_missions_passed" ADD CONSTRAINT "user_to_primary_missions_passed_primary_mission_id_primary_missions_id_fk" FOREIGN KEY ("primary_mission_id") REFERENCES "public"."primary_missions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_quick_quizzes_passed" ADD CONSTRAINT "user_to_quick_quizzes_passed_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_quick_quizzes_passed" ADD CONSTRAINT "user_to_quick_quizzes_passed_quick_quiz_id_quick_quizzes_id_fk" FOREIGN KEY ("quick_quiz_id") REFERENCES "public"."quick_quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_course_taken" ADD CONSTRAINT "user_to_course_taken_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_course_taken" ADD CONSTRAINT "user_to_course_taken_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;