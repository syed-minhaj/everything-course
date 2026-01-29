
import { createServerFn } from "@tanstack/react-start";
import { geminiGenerator } from "@/lib/gemini";
import { db } from "@/lib/drizzle";
import { courses , modules , externalResources , primaryMissions , quickQuizzes } from "db/schema";
import {z} from "zod"
import { redirect } from "@tanstack/react-router";
import { auth } from "@/lib/auth";
import { getRequestHeaders } from "@tanstack/react-start-server";



const courseInputSchema = z.object({
    topic: z.string(),
    userContext: z.string(),
    depthLevel: z.string()
})
export const generateCourse = createServerFn({method: 'POST'})
    .inputValidator(courseInputSchema)
    .handler(async ({data}) => {
        try {
            const { topic, userContext, depthLevel } = await data;
            const session = await auth.api.getSession({ headers: getRequestHeaders()});
            if (!session || !session.user) {
                throw redirect({to : "/app/auth/$authView" , params : {authView : "login"}})
            }
            const {success , course } = await geminiGenerator({course : {topic, userContext, depthLevel}})
            if (!success) return {error : "Failed to generate course"};
            const courseCreated = await db.insert(courses).values({courseTitle: course.course_title, introSummary: course.intro_summary , createrId : session.user.id}).returning({id : courses.id});
            if (!courseCreated) return {error : "Failed to create course"};
            const courseID = courseCreated[0].id;
            for (const module of course.modules) {
                const moduleCreated = await db.insert(modules).values({courseId : courseID, title : module.title, conceptualDeepDive : module.conceptual_deep_dive}).returning({id : modules.id});
                if (!moduleCreated) return {error : "Failed to create module"};
                const moduleID = moduleCreated[0].id;
                for (const resource of module.external_resources) {
                    await db.insert(externalResources).values({moduleId : moduleID, type : resource.type, title : resource.title, url : resource.url});
                }
                //for (const mission of module.assessment.primary_mission.rubric) {
                    await db.insert(primaryMissions).values({moduleId : moduleID, title : module.assessment.primary_mission.title, instructions : module.assessment.primary_mission.instructions, rubric : module.assessment.primary_mission.rubric});
                //}
                for (const quiz of module.assessment.quick_quiz) {
                    await db.insert(quickQuizzes).values({moduleId : moduleID, question : quiz.question, options : quiz.options, answer : quiz.answer});
                }
            }
            console.log("success")
            return {error : null}

        }catch(e ){
            console.error(e)
            if (e instanceof Error) return {error : e.message}
            else return {error : "Unknown error"}
        }
});

