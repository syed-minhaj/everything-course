import { TaskContextProvider } from '@/components/taskContextProvider'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import {z} from "zod";
import { db } from '@/lib/drizzle'
import { Separator } from '@/components/ui/separator'
import Task from './components/-task'
import Content from './components/-content';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import Topbar from './components/-topbar';
import { getRequestHeaders } from '@tanstack/react-start-server';
import { auth } from '@/lib/auth';

const getCourse = createServerFn().inputValidator(z.string()).handler(async ({ data }) => {
    let course = await db.query.courses.findFirst({
        where: (courses , {eq}) => eq(courses.id , data),
        with : {
            modules : true,
            student : {
                columns : {userId : true}
            }
        }
    })
    const session = await auth.api.getSession({ headers: getRequestHeaders()});
    if (!course) {
        throw redirect({to : "/app/course"})
    };
    if (course.student.some((student) => student.userId == session?.user.id)) {
        return Object.assign(course , {isStudent : true})
    }else {
        return Object.assign(course , {isStudent : false})
    }
})

export const Route = createFileRoute('/app/course/$courseID_/$moduleID')({
    component: RouteComponent,
    loader: async ({ params }) => await getCourse({ data : params.courseID }),
})

function RouteComponent() {
    const course = Route.useLoaderData();
    const { moduleID} = Route.useParams() 
    

    return (
        <div className='flex flex-col  bg-bg1 flex-1 overflow-scroll  ' style={{scrollbarWidth : "none"}}>
            <TaskContextProvider>
                <Topbar modules={course.modules} moduleID={moduleID} />
                <Separator className=" bg-black/50" />
                <ResizablePanelGroup direction="horizontal" className='flex flex-row h-[calc(100%-(48px+8px))] '>
                    <ResizablePanel className='overflow-y-auto!' defaultSize={50}>
                        <Content moduleID={moduleID} course={course}/>
                    </ResizablePanel>
                    <ResizableHandle className=' bg-black/50 ' />
                    <ResizablePanel className={`${course.isStudent && 'overflow-y-auto! '} relative  `} defaultSize={50}>
                        {!course.isStudent && 
                            <div className=" backdrop-blur-md absolute top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center text-lg font-medium">
                                Inrole to course first
                                <Link to="/app/course/$courseID" params={{courseID: course.id}} className="ml-2 text-primary"> Go to course</Link>
                            </div>
                        }
                        <Task moduleID={moduleID} />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </TaskContextProvider>
        </div>
    )
}


