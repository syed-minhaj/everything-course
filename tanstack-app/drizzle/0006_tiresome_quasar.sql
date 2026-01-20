CREATE TABLE "user_to_primary_missions_passed" (
	"user_id" text NOT NULL,
	"primary_mission_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_to_quick_quizzes_passed" (
	"user_id" text NOT NULL,
	"quick_quiz_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_to_primary_missions_passed" ADD CONSTRAINT "user_to_primary_missions_passed_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_primary_missions_passed" ADD CONSTRAINT "user_to_primary_missions_passed_primary_mission_id_primary_missions_id_fk" FOREIGN KEY ("primary_mission_id") REFERENCES "public"."primary_missions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_quick_quizzes_passed" ADD CONSTRAINT "user_to_quick_quizzes_passed_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_quick_quizzes_passed" ADD CONSTRAINT "user_to_quick_quizzes_passed_quick_quiz_id_quick_quizzes_id_fk" FOREIGN KEY ("quick_quiz_id") REFERENCES "public"."quick_quizzes"("id") ON DELETE no action ON UPDATE no action;