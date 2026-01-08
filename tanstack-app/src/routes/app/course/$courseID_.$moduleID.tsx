import { TaskContextProvider } from '@/components/taskContextProvider'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import {z} from "zod";
import { db } from '@/lib/drizzle'
import { Separator } from '@/components/ui/separator'
import Task from './components/task'
import Content from './components/content';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import Topbar from './components/topbar';

const getCourse = createServerFn().inputValidator(z.string()).handler(async ({ data }) => {
    const course = await db.query.courses.findFirst({
        where: (courses , {eq}) => eq(courses.id , data),
        with : {
            modules : true
        }
    })
    if (!course) {
        throw redirect({to : "/app/course"})
    };
    return course
})

export const Route = createFileRoute('/app/course/$courseID_/$moduleID')({
    component: RouteComponent,
    loader: async ({ params }) => await getCourse({ data : params.courseID }),
})

function RouteComponent() {
    const course = Route.useLoaderData();
    const { moduleID} = Route.useParams() 
    return (
        <div className='flex flex-col  bg-bg1 flex-1 overflow-scroll ' style={{scrollbarWidth : "none"}}>
            <TaskContextProvider>
                <Topbar modules={course.modules} moduleID={moduleID} />
                <Separator className="py-1 bg-black/50" />
                <ResizablePanelGroup direction="horizontal" className='flex flex-row h-[calc(100%-(48px+8px))] '>
                    <ResizablePanel className='overflow-y-auto!' defaultSize={50}>
                        <Content moduleID={moduleID} course={course}/>
                    </ResizablePanel>
                    <ResizableHandle className='px-1 bg-black/50' />
                    <ResizablePanel className='overflow-y-auto!' defaultSize={50}>
                        <Task moduleID={moduleID} />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </TaskContextProvider>
        </div>
    )
}
