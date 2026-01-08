import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { db } from '@/lib/drizzle'
import { createFileRoute, Link, Outlet, redirect, useLoaderData } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { courses } from 'db/schema'
import { eq } from 'drizzle-orm'
import {z} from "zod";

type course = {
    id: string;
    courseTitle: string;
    introSummary: string;
    modules: {
        id: string;
        title: string;
        courseId: number;
        conceptualDeepDive: string;
    }[];
}

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


export const Route = createFileRoute('/app/course/$courseID')({
    
    loader:  async({ params }) => await getCoursee({ data : params.courseID }),
    component: RouteComponent,
    pendingComponent: () => <div>Loading Course...</div>,
})


function RouteComponent() {
    const course = Route.useLoaderData();
    const courseID = course.id;
    
    return (
        <div className='bg-bg1  '>
            <div className='w-full h-screen relative '>
                <div className='bg-[url(/bgImage.webp)] bg-cover bg-center w-full h-full absolute '/>
                <div className='bg-black/66 w-full h-full absolute flex flex-col justify-center items-center'>
                    <div className='flex flex-col gap-8 items-center justify-center'>
                        <h2 className='font-irish-grover text-2xl sm:text-4xl text-center text-white '>{course.courseTitle}</h2>
                        <div className='flex flex-row gap-6 text-white text-lg font-bold'>
                            <Link to="/app/course/$courseID/$moduleID" params={{courseID , moduleID : course.modules[0].id }}
                                className='py-4 px-6 rounded-sm  bg-[#3A10E5]' >Join Coure</Link>
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
