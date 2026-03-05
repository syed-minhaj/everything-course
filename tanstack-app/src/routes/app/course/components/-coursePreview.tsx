import { Link } from "@tanstack/react-router"
import { course } from ".."
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/drizzle";
import { auth } from "@/lib/auth";
import { getRequestHeaders } from "@tanstack/react-start-server";
import { z } from "zod";
import { courses, modules, primaryMissions, quickQuizzes, userToPrimaryMissionsPassed, userToQuickQuizzesPassed } from "db/schema";
import { and, countDistinct, eq } from "drizzle-orm";
import { useQuery } from "@tanstack/react-query";


const getNoOfModuleComplelted = createServerFn().inputValidator(z.string()).handler(async ({ data }) => {
    const session = await auth.api.getSession({ headers: getRequestHeaders()});
    
    if (!session || !session.user) {
        return 0
    }
    const result = await db.select({
        count: countDistinct(modules.id) 
    })
        .from(modules)
        .innerJoin(courses, eq(modules.courseId, courses.id))
        .innerJoin(quickQuizzes, eq(modules.id, quickQuizzes.moduleId))
        .innerJoin(primaryMissions, eq(modules.id, primaryMissions.moduleId))
        .innerJoin(userToQuickQuizzesPassed, eq(quickQuizzes.id, userToQuickQuizzesPassed.quickQuizId))
        .innerJoin(userToPrimaryMissionsPassed, eq(primaryMissions.id, userToPrimaryMissionsPassed.primaryMissionId))
        .where(and(
            eq(courses.id, data),
            eq(userToQuickQuizzesPassed.userId, session.user.id),
            eq(userToPrimaryMissionsPassed.userId, session.user.id)
        ))
        .execute();

    const moduleCount = result[0]?.count ?? 0;
    return moduleCount;

})


function CoursePreview({course} : {course : course}) {

    const data = useQuery({
        queryKey: ["noOfModuleComplelted" , course.id],
        queryFn: async() => getNoOfModuleComplelted({data : course.id}),
        gcTime: 1000 * 60 * 60 * 24 * 7,
    })

    return (
        <Link to="/app/course/$courseID" params={{courseID : course.id}} className="bg-bg2 w-full border border-black dark:border-white/50 hover:border-amber-400">
            <div className="w-11/12 mx-auto my-4 flex flex-col gap-4">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex-1">
                        <h3 className=" font-light opacity-50">Course</h3>
                        <h3 className=" font-medium text-2xl">{course.courseTitle}</h3>
                    </div>
                    <span className="opacity-50 w-fit" >{data.data ?? 0} / {course.no_of_modules}</span>
                </div>
                <p className="md:w-5/6 ">{course.introSummary}</p>
            </div>
        </Link>
    )
}

function CourseSkeleton() {
    return (
        <div className="bg-bg2 w-full border border-black dark:border-white/50 hover:border-amber-400">
            <div className="w-11/12 mx-auto my-4 flex flex-col gap-4">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex-1 flex flex-col gap-1">
                        <h3 className=" font-light opacity-50">Course</h3>
                        <h3 className="w-80 h-8 bg-gray-500/70 dark:bg-gray-200/60 rounded animate-pulse"></h3>
                    </div>
                </div>
                <p className="w-5/6 h-20 bg-gray-500/50 dark:bg-gray-200/40 rounded animate-pulse"></p>
            </div>
        </div>
    )
}

export {CourseSkeleton}

export default CoursePreview
