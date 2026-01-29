import { db } from "@/lib/drizzle"
import { createServerFn } from "@tanstack/react-start"
import { externalResources , modules} from "db/schema"
import { eq } from "drizzle-orm";
import {z} from "zod";
import Resourse from "./-resourse";
import { Suspense } from "react";

type typeCourse = {
    id: string;
    courseTitle: string;
    introSummary: string;
    modules: {
        id: string;
        courseId: string;
        title: string;
        conceptualDeepDive: string;
    }[];
}


export default function Content({moduleID , course} : {moduleID : string , course : typeCourse}) {
    
    const module = course.modules.find((m) => m.id === moduleID)
    if (!module) {
        return <div>Module Not Found</div>
    }
    
    return (
        <div className="flex flex-col flex-1  px-12 py-6 gap-9">
            <h3 className="font-irish-grover text-[2rem]">{module.title}</h3>
            <p className="text-xl">{module.conceptualDeepDive}</p>
            <Suspense>
                <Resourse moduleID={moduleID}/>
            </Suspense>
        </div>
    )
}
