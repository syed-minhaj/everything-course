import Resourse from "./-resourse";
import { Suspense } from "react";

type typeChapter = {
    id: string;
    courseId: string;
    title: string;
    order: number;
    modules: {
        id: string;
        courseId: string;
        chapterId: string | null;
        title: string;
        conceptualDeepDive: string;
    }[];
}

type typeCourse = {
    id: string;
    courseTitle: string;
    introSummary: string;
    chapters: typeChapter[];
}


export default function Content({moduleID , course} : {moduleID : string , course : typeCourse}) {
    
    const module = course.chapters.flatMap((c) => c.modules).find((m) => m.id === moduleID)
    if (!module) {
        return <div>Module Not Found</div>
    }
    
    return (
        <div className="flex flex-col flex-1 px-6 sm:px-12 py-6 gap-9">
            <h3 className="font-irish-grover text-[1.5rem] sm:text-[2rem]">{module.title}</h3>
            <p className="text-lg sm:text-xl">{module.conceptualDeepDive}</p>
            <Suspense>
                <Resourse moduleID={moduleID}/>
            </Suspense>
        </div>
    )
}
