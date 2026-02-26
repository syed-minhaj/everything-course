import { courseType } from "@/types"

type resourseType = courseType["modules"][number]["external_resources"][number] & {
    id: string;
    moduleId: string;
}

export default function ResourseItem({resource} : {resource : resourseType}) {
    return (
        <div key={resource.id} 
            className="flex flex-col p-4 text-lg border border-black dark:border-gray-200 rounded bg-bg2 w-full gap-1">
            <h3 className="">{resource.title}</h3>
            {(resource.type == "youtube video" )?
                <iframe src={resource.url} className="w-full aspect-video" allowFullScreen></iframe>
            :
            <a href={resource.url} target="_blank" className="text-primary break-all">
                {resource.url}
            </a>
            }
        </div>
    )
}