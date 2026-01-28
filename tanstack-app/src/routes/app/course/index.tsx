import { db } from '@/lib/drizzle'
import { createFileRoute } from '@tanstack/react-router'
import { courses, modules } from 'db/schema'
import CoursePreview from './components/-coursePreview'
import { count, eq } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'
import { Suspense } from 'react'
import {useSuspenseQuery} from "@tanstack/react-query"

export type course = {
    id : string;
    courseTitle : string;
    introSummary : string;
    no_of_modules : number;
}

const getCourses = createServerFn().handler(async () => {
    
    return await db.select({
        id :courses.id,
        courseTitle : courses.courseTitle,
        introSummary : courses.introSummary,
        no_of_modules : count(courses.id),
    }).from(courses).leftJoin(modules , eq(courses.id , modules.courseId)).groupBy(courses.id)
})

function CourseSection(){
    const {data} = useSuspenseQuery({
        queryKey: ['courses'],
        queryFn: getCourses,
    })
    return (
        <div className='w-11/12 mx-auto flex flex-col gap-4 pt-8 '>
            {data.map((course : course) => (
                <CoursePreview key={course.id} course={course} />
            ))}
        </div>
    )
}

export const Route = createFileRoute('/app/course/')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className='bg-bg1 flex-1  overflow-auto'>
            <h2 className='font-irish-grover text-4xl mx-auto py-34 text-center bg-[url(/bgImageCoursePage.webp)] bg-cover bg-center
             border-b-amber-400 border-b-4  ' >
                Course Catalog
            </h2>
            <Suspense fallback={<div></div>}>
                <CourseSection />
            </Suspense>
        </div>
    )
}
