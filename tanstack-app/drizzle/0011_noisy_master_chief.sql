ALTER TABLE "user_to_primary_missions_passed" ADD CONSTRAINT "user_to_primary_missions_passed_user_id_primary_mission_id_pk" PRIMARY KEY("user_id","primary_mission_id");--> statement-breakpoint
ALTER TABLE "user_to_quick_quizzes_passed" ADD CONSTRAINT "user_to_quick_quizzes_passed_user_id_quick_quiz_id_pk" PRIMARY KEY("user_id","quick_quiz_id");--> statement-breakpoint
ALTER TABLE "user_to_course_taken" ADD CONSTRAINT "user_to_course_taken_user_id_course_id_pk" PRIMARY KEY("user_id","course_id");--> statement-breakpoint
ALTER TABLE "user_to_primary_missions_passed" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "user_to_quick_quizzes_passed" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "user_to_course_taken" DROP COLUMN "id";