import { useTaskContextValue } from '@/components/taskContextProvider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger , SelectGroup, SelectValue } from '@/components/ui/select'
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState, useMemo } from 'react';

type moduleType = {
    id: string;
    courseId: string;
    title: string;
    conceptualDeepDive: string;
}

type chapterType = {
    id: string;
    courseId: string;
    title: string;
    order: number;
    modules: moduleType[];
}

export default function Topbar({chapters , moduleID} : {chapters : chapterType[] , moduleID : string}) {

    const allModules = useMemo(() => chapters.flatMap((c) => c.modules), [chapters]);

    const [selectedChapterId, setSelectedChapterId] = useState<string>('')
    const [selectedValue, setSelectedValue] = useState<string>(moduleID)
    const [isNext , setIsNext] = useState(false)
    const [isPrev , setIsPrev] = useState(false)
    const selectedModule = allModules.find((m) => m.id === selectedValue)
    const {task ,setTask} = useTaskContextValue()
    const navigate = useNavigate()

    const currentChapterModules = useMemo(
        () => chapters.find((c) => c.id === selectedChapterId)?.modules ?? [],
        [chapters, selectedChapterId]
    )

    useEffect(() => {
        const chapter = chapters.find((c) => c.modules.some((m) => m.id === moduleID));
        if (chapter) setSelectedChapterId(chapter.id);
    }, [moduleID, chapters]);

    useEffect(() => {
        if (!selectedModule) return
        if (selectedModule.id === moduleID) return
        navigate({to : "/app/course/$courseID/$moduleID" , reloadDocument: true , params : {courseID : selectedModule.courseId , moduleID : selectedModule.id}})
    }, [selectedValue])

    function handleChapterChange(chapterId: string) {
        const chapter = chapters.find((c) => c.id === chapterId);
        if (!chapter || chapter.modules.length === 0) return;
        setSelectedChapterId(chapterId);
        const firstModule = chapter.modules[0];
        navigate({to : "/app/course/$courseID/$moduleID" , reloadDocument: true , params : {courseID : firstModule.courseId , moduleID : firstModule.id}})
    }

    useEffect(() => {
        const firstModule = allModules[0]
        const lastModule = allModules[allModules.length - 1]
        if (task === "Quiz") {
            setIsNext(true)
            if (moduleID !== firstModule.id) setIsPrev(true)
            else setIsPrev(false)
        }else{
            setIsPrev(true)
            if (moduleID !== lastModule.id) setIsNext(true)
            else setIsNext(false)
        }
    }, [task, selectedModule ])

    function next() {
        if (task === "Quiz") {
            setTask("Mission")
        } else {
            const lastModule = allModules[allModules.length - 1]
            if (moduleID === lastModule.id) {
                navigate({to : "/app/course"})
                return
            }
            const indexofCurrentModule = allModules.findIndex((m) => m.id === moduleID)
            const nextModule = allModules[indexofCurrentModule + 1]
            navigate({to : "/app/course/$courseID/$moduleID" 
                , reloadDocument: true , params : {courseID : allModules[0].courseId , moduleID : nextModule.id }
            })
        }
    }
    function prev() {
        if (task === "Quiz") {
            const firstModule = allModules[0]
            if (moduleID === firstModule.id) {
                navigate({to : "/app/course"})
                return
            }
            const indexofCurrentModule = allModules.findIndex((m) => m.id === moduleID)
            const lastModule = allModules[indexofCurrentModule - 1]
            navigate({to : "/app/course/$courseID/$moduleID" 
                , reloadDocument: true ,  params : {courseID : allModules[0].courseId , moduleID : lastModule.id }
            })
        } else {
            setTask("Quiz")
        }
        
    }

    return (
        <div className='flex flex-row items-center justify-end gap-4 px-6 md:px-8 py-1 relative '>
            {isPrev && 
                <Button onClick={prev} className='rounded-4xl px-3 absolute left-6 md:left-8'>{"<--"}</Button>
            }
            <div className='pr-15 flex flex-row gap-4'>
                <Select value={selectedChapterId} onValueChange={handleChapterChange}>
                    <SelectTrigger className='bg-bg2 rounded '>
                            <SelectValue placeholder='Chapter'>
                                <span>{chapters.find((c) => c.id === selectedChapterId)?.title.split(":")[0]}</span>
                            </SelectValue>
                    </SelectTrigger>
                    <SelectContent className='rounded'>
                        <SelectGroup>
                            {chapters.map((chapter) => (
                                <SelectItem key={chapter.id} value={chapter.id}>
                                    {chapter.title}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select value={selectedValue} onValueChange={setSelectedValue}>
                    <SelectTrigger className='bg-bg2 rounded '>
                            <SelectValue placeholder='Module'>
                                <span className=''>{selectedModule?.title.split(":")[0]}</span>
                            </SelectValue>
                    </SelectTrigger>
                    <SelectContent className='rounded'>
                        <SelectGroup>
                            {currentChapterModules.map((module) => (
                                <SelectItem key={module.id} value={module.id}>
                                    {module.title}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select  value={task} onValueChange={setTask}>
                    <SelectTrigger className='bg-bg2 rounded '>
                            <SelectValue placeholder='Task'/>
                    </SelectTrigger>
                    <SelectContent className='rounded'>
                        <SelectGroup>
                            <SelectItem value={"Quiz"}>
                                Quiz
                            </SelectItem>
                            <SelectItem value={"Mission"}>
                                Mission
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            {isNext && 
                <Button onClick={next} className='rounded-4xl px-3 absolute right-6 nd:right-8'>{"-->"}</Button>
            }
        </div>
    )
}
