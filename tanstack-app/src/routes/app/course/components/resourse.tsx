import { db } from "@/lib/drizzle"
import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import { externalResources } from "db/schema"
import { eq } from "drizzle-orm"
import { use, useEffect, useState } from "react"
import ResourseItem from "./resourseItem"
import { useSuspenseQuery } from "@tanstack/react-query"


type resourseType = {
    id: string;
    title: string;
    moduleId: string;
    type: string;
    url: string;
}

const getResources = createServerFn().inputValidator(z.string()).handler(async ({ data }) => {
    const resources = await db.query.externalResources.findMany({
        where: eq(externalResources.moduleId , data),
    })
    console.log(resources)
    return resources
})

export default function Resourse({moduleID} : {moduleID : string}) {
    //const [resources , setResources] = useState<resourseType[]>([])
    // const [articles , setArticles] = useState<resourseType[]>([])
    // const [videos , setVideos] = useState<resourseType[]>([])
    // const [podcasts , setPodcasts] = useState<resourseType[]>([])
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
            case "youtube video(in embed form)":
                videos.push(resource)
                break;
            case "podcast":
                podcasts.push(resource)
                break;
        }
    })
    
    // useEffect(() => {
    //     getResources({ data : moduleID }).then((res) => {
    //         console.log(res)
    //         res.forEach((resource) => {
    //             switch (resource.type) {
    //                 case "article":
    //                     setArticles((articles) => [...articles , resource])
    //                     break;
    //                 case "youtube video(in embed form)":
    //                     setVideos((videos) => [...videos , resource])
    //                     break;
    //                 case "podcast":
    //                     setPodcasts((podcasts) => [...podcasts , resource])
    //                     break;
    //             }
    //         })
    //         //setResources([...articles , ...videos , ...podcasts])
    //     })
    // }, [])

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
