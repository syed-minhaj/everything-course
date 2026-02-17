import { Separator } from '@/components/ui/separator'
import { db } from '@/lib/drizzle'
import { createFileRoute,  redirect } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import {z} from "zod";
import { getRequestHeaders } from "@tanstack/react-start-server";
import { auth } from '@/lib/auth'
import { userToCourseTaken } from 'db/auth-schema'
import { useState } from 'react'


const courseIDSchema = z.string()
const getCoursee = createServerFn()
    .inputValidator(courseIDSchema)
    .handler(async({data}) => {
        const course = await db.query.courses.findFirst({
            where: (courses , {eq}) => eq(courses.id , data),
            with : {
                modules : true,
            }
        })
        if (!course) {
            throw redirect({to : "/app/course"})
        };
        return course
})

const joinCourseFn = createServerFn()
    .inputValidator(z.object({courseID : courseIDSchema , moduleID : z.string()}))
    .handler(async({data}) => {
        const session = await auth.api.getSession({ headers: getRequestHeaders()});
        if (!session || !session.user) {
            throw redirect({to : "/app/auth/$authView" , params : {authView : "login"}})
        }
        const userHasTakenCourse = await db.query.userToCourseTaken.findFirst({
            where : (userToCourseTaken , {eq,and}) => and(eq(userToCourseTaken.userId , session.user.id) , eq(userToCourseTaken.courseId , data.courseID) )
        })
        if (userHasTakenCourse) {
            throw redirect({to : "/app/course/$courseID/$moduleID" , params : {courseID : data.courseID , moduleID : data.moduleID}})
        }
        await db.insert(userToCourseTaken).values({userId : session.user.id , courseId : data.courseID})
        throw redirect({to : "/app/course/$courseID/$moduleID" , params : {courseID : data.courseID , moduleID : data.moduleID}})
    })


export const Route = createFileRoute('/app/course/$courseID')({
    loader:  async({ params }) => await getCoursee({ data : params.courseID }),
    component: RouteComponent,
    pendingComponent: () => <div>Loading Course...</div>,
})


function RouteComponent() {
    const course = Route.useLoaderData();
    const joinCourse = useServerFn(joinCourseFn)
    const [isLoading, setIsLoading] = useState(false)
    
    async function join(data : {courseID : string , moduleID : string}) {
        setIsLoading(true)
        await joinCourse({data})
        setIsLoading(false)
    }

    return (
        <div className='bg-bg1  '>
            <div className='w-full h-screen relative '>
                <div className='bg-[url(/bgImage.webp)] bg-cover bg-center w-full h-full absolute '/>
                <div className='bg-black/66 w-full h-full absolute flex flex-col justify-center items-center'>
                    <div className='flex flex-col gap-8 items-center justify-center'>
                        <h2 className='font-irish-grover text-2xl sm:text-4xl text-center text-white '>{course.courseTitle}</h2>
                        <div className='flex flex-row gap-6 text-white text-lg font-bold'>
                            <button onClick={() => join({courseID: course.id , moduleID : course.modules[0].id})} 
                                className='py-4 px-6 rounded-sm  bg-[#3A10E5] disabled:opacity-25' disabled={isLoading} >Join Coure</button>
                            <a href="#detail" className='py-4 px-6 rounded-sm  bg-[#919191]'>Learn More</a>
                        </div>
                    </div>
                </div>
            </div>
            <div id="detail" className='flex flex-col items-center py-32 gap-28'>
                <div className='flex flex-col items-center w-190 max-w-11/12'>
                    <h3 className='font-medium text-2xl/[250%]'>Course Summary</h3>
                    <p className='text-xl/[250%] text-center'>{course.introSummary}</p>
                </div>
                <div className='flex flex-col items-center  max-w-11/12'>
                    <h3 className='font-medium text-2xl/[250%] pb-5'>Modules</h3>
                    {course.modules.map((module , index) => (
                        <>
                            <div key={index} className='pr-4 flex flex-row gap-2 w-full text-lg/[100%] sm:text-xl/[100%]'>
                                <h6 className='w-fit'>{index + 1}: </h6>
                                <p className='flex-1'>{module.title}</p>
                            </div>
                            {index !== course.modules.length - 1 && <Separator key={index} className="my-4 bg-black/50" />}
                        </>
                    ))}
                </div>
            </div>
        </div>
    )
}
