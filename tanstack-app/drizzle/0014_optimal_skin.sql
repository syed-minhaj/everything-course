CREATE INDEX "course_id_idx" ON "courses" USING btree ("id");--> statement-breakpoint
CREATE INDEX "course_createrId_idx" ON "courses" USING btree ("creater_id");--> statement-breakpoint
CREATE INDEX "external_resources_moduleId_idx" ON "external_resources" USING btree ("module_id");--> statement-breakpoint
CREATE INDEX "module_courseId_idx" ON "modules" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "module_title_idx" ON "modules" USING btree ("title");--> statement-breakpoint
CREATE INDEX "primary_missions_moduleId_idx" ON "primary_missions" USING btree ("module_id");--> statement-breakpoint
CREATE INDEX "quick_quizzes_moduleId_idx" ON "quick_quizzes" USING btree ("module_id");--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "user" USING btree ("id");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "user" USING btree ("email");