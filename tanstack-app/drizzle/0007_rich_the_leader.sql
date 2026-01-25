CREATE TABLE "user_to_course_created" (
	"user_id" text NOT NULL,
	"course_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_to_course_taken" (
	"user_id" text NOT NULL,
	"course_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_to_course_created" ADD CONSTRAINT "user_to_course_created_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_course_created" ADD CONSTRAINT "user_to_course_created_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_course_taken" ADD CONSTRAINT "user_to_course_taken_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_course_taken" ADD CONSTRAINT "user_to_course_taken_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;