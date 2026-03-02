import { db } from '@/lib/drizzle'
import { createFileRoute } from '@tanstack/react-router'
import { courses, modules } from 'db/schema'
import CoursePreview from './components/-coursePreview'
import { count, eq } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'
import { Suspense, useEffect, useRef } from 'react'
import {useInfiniteQuery} from "@tanstack/react-query"
import z from 'zod'

export type course = {
    id : string;
    courseTitle : string;
    introSummary : string;
    no_of_modules : number;
}

const COURSES_PER_PAGE = 10;

const getCourses = createServerFn()
    .inputValidator(z.number().optional())
    .handler(
    async ({ data = 0 }) => {
        return await db
            .select({
                id: courses.id,
                courseTitle: courses.courseTitle,
                introSummary: courses.introSummary,
                no_of_modules: count(modules.id),
            })
            .from(courses).leftJoin(modules, eq(courses.id, modules.courseId))
            .groupBy(courses.id).limit(COURSES_PER_PAGE).offset(data)
    }
)

function CourseSection() {
    const loadMoreRef = useRef<HTMLDivElement | null>(null)
    const {data,fetchNextPage,hasNextPage,isFetchingNextPage} = useInfiniteQuery({
        queryKey: ['courses'],
        initialPageParam: 0,
        queryFn: ({ pageParam }) => getCourses({ data : pageParam }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < COURSES_PER_PAGE) return undefined
            return allPages.length * COURSES_PER_PAGE
        },
    })

    useEffect(() => {
        if (!hasNextPage) return
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                fetchNextPage()
                }
            },
            { threshold: 1 }
        )
        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current)
        }
        return () => observer.disconnect()
    }, [fetchNextPage, hasNextPage])

    return (
        <div className="w-11/12 mx-auto flex flex-col gap-4 py-8">
            {data?.pages.map((page) =>
                page.map((course: course) => (
                    <CoursePreview key={course.id} course={course} />
                ))
            )}

            <div ref={loadMoreRef} />
            {isFetchingNextPage && <p className='mx-auto'>Loading more courses…</p>}
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
