
import { createServerFn } from "@tanstack/react-start";
import { geminiGenerator } from "@/lib/gemini";
import { db } from "@/lib/drizzle";
import { courses , modules , externalResources , primaryMissions , quickQuizzes } from "db/schema";
import {z} from "zod"
import { auth } from "@/lib/auth";
import { getRequestHeaders } from "@tanstack/react-start-server";
import { user } from "db/auth-schema";
import { eq } from "drizzle-orm";


const courseInputSchema = z.object({
    topic: z.string(),
    userContext: z.string(),
    depthLevel: z.string()
})

const userAllowedToCreateCourse = async(userID : string) => {
    const courseCount = await db.select({
        id : user.id
    }).from(user).where(eq(user.id , userID)).execute();
    return courseCount.length < 2;
}

export const generateCourse = createServerFn({method: 'POST'})
    .inputValidator(courseInputSchema)
    .handler(async ({data}) => {
        try {
            const { topic, userContext, depthLevel } = await data;
            const session = await auth.api.getSession({ headers: getRequestHeaders()});
            if (!session || !session.user) {
                return {error : "Not logged in" , course: null};
            }
            const AdminID = process.env.ADMIN_ID;
            if (session.user.id !== AdminID && !(await userAllowedToCreateCourse(session.user.id))) {
                return {error : "Not allowed to create course (max 2 courses per user)" , course: null};
            }

            const {success , course } = await geminiGenerator({course : {topic, userContext, depthLevel}})
            if (!success) return {error : "Failed to generate course" , course: null};
            const courseCreated = await db.insert(courses).values({courseTitle: course.course_title, introSummary: course.intro_summary , createrId : session.user.id}).returning({id : courses.id , title : courses.courseTitle});
            if (!courseCreated) return {error : "Failed to create course", course: null};
            const courseID = courseCreated[0].id;
            for (const module of course.modules) {
                const moduleCreated = await db.insert(modules).values({courseId : courseID, title : module.title, conceptualDeepDive : module.conceptual_deep_dive}).returning({id : modules.id});
                if (!moduleCreated) return {error : "Failed to create module" ,course: null};
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
            return {error : null , course: {id : courseID , title : courseCreated[0].title}};

        }catch(e ){
            console.error(e)
            if (e instanceof Error) return {error : e.message , course: null}
            else return {error : "Unknown error" , course: null}
        }
});

