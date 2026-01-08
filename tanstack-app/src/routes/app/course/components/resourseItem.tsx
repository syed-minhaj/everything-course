
type resourseType = {
    id: string;
    title: string;
    moduleId: string;
    type: string;
    url: string;
}

export default function ResourseItem({resource} : {resource : resourseType}) {
    return (
        <div key={resource.id} 
            className="flex flex-col p-4 text-lg border border-black rounded bg-bg2 w-full gap-1">
            <h3 className="">{resource.title}</h3>
            {resource.type == "youtube video(in embed form)" ?
                <iframe src={resource.url} className="w-full aspect-video" allowFullScreen></iframe>
            :
            <a href={resource.url} target="_blank" className="text-primary break-all">
                {resource.url}
            </a>
            }
        </div>
    )
}