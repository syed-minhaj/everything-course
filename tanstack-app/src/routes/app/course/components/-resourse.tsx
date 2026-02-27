import { db } from "@/lib/drizzle"
import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import { externalResources } from "db/schema"
import { eq } from "drizzle-orm"
import ResourseItem from "./-resourseItem"
import { useSuspenseQuery } from "@tanstack/react-query"
import { courseType } from "@/types"


type resourseType = courseType["modules"][number]["external_resources"][number] & {
    id: string;
    moduleId: string;
}

const getResources = createServerFn().inputValidator(z.string()).handler(async ({ data }) => {
    const resources = await db.query.externalResources.findMany({
        where: eq(externalResources.moduleId , data),
    })
    return resources
})

export default function Resourse({moduleID} : {moduleID : string}) {
    const {data : resource} = useSuspenseQuery({
        queryKey: ["resources" , moduleID],
        queryFn: async() => getResources({data : moduleID})
    })

    let articles : resourseType[] = []
    let videos : resourseType[] = []
    let podcasts : resourseType[] = []
    resource.forEach((resource) => {
        switch (resource.type) {
            case "article":
                articles.push(resource)
                break;
            case "youtube video":
                videos.push(resource)
                break;
            case "podcast":
                podcasts.push(resource)
                break;
        }
    })
    

    return (
        <div className="flex flex-col gap-4">
            {articles.length > 0 && <h3 className="font-medium text-2xl">Articles :</h3>}
            {articles.map((article , index) => (
                <ResourseItem key={index} resource={article} />
            ))}
            {videos.length > 0 && <h3 className="font-medium text-2xl">Videos :</h3>}
            {videos.map((video , index) => (
                <ResourseItem key={index} resource={video} />
            ))}
            {podcasts.length > 0 && <h3 className="font-medium text-2xl">Podcasts :</h3>}
            {podcasts.map((podcast , index) => (
                <ResourseItem key={index} resource={podcast} />
            ))}
        </div>
    )
}
