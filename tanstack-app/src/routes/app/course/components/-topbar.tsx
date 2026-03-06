import { useTaskContextValue } from '@/components/taskContextProvider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger , SelectGroup, SelectValue } from '@/components/ui/select'
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

type moduleType = {
    id: string;
    courseId: string;
    title: string;
    conceptualDeepDive: string;
}

export default function Topbar({modules , moduleID} : {modules : moduleType[] , moduleID : string}) {

    const [selectedValue, setSelectedValue] = useState<string>(moduleID)
    const [isNext , setIsNext] = useState(false)
    const [isPrev , setIsPrev] = useState(false)
    const selectedModule = modules.find((m) => m.id === selectedValue)
    const {task ,setTask} = useTaskContextValue()
    const navigate = useNavigate()
 
    useEffect(() => {
        if (!selectedModule) return
        if (selectedModule.id === moduleID) return
        navigate({to : "/app/course/$courseID/$moduleID" , reloadDocument: true , params : {courseID : selectedModule.courseId , moduleID : selectedModule.id}})
    }, [selectedValue])

    useEffect(() => {
        const firstModule = modules[0]
        const lastModule = modules[modules.length - 1]
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
            const lastModule = modules[modules.length - 1]
            if (moduleID === lastModule.id) {
                navigate({to : "/app/course"})
                return
            }
            const indexofCurrentModule = modules.findIndex((m) => m.id === moduleID)
            const nextModule = modules[indexofCurrentModule + 1]
            navigate({to : "/app/course/$courseID/$moduleID" 
                , params : {courseID : modules[0].courseId , moduleID : nextModule.id }
            })
        }
    }
    function prev() {
        if (task === "Quiz") {
            const firstModule = modules[0]
            if (moduleID === firstModule.id) {
                navigate({to : "/app/course"})
                return
            }
            const indexofCurrentModule = modules.findIndex((m) => m.id === moduleID)
            const lastModule = modules[indexofCurrentModule - 1]
            navigate({to : "/app/course/$courseID/$moduleID" 
                ,  params : {courseID : modules[0].courseId , moduleID : lastModule.id }
            })
        } else {
            setTask("Quiz")
        }
        
    }

    return (
        <div className='flex flex-row items-center justify-end gap-4 px-8 py-1 relative '>
            {isPrev && 
                <Button onClick={prev} className='rounded-4xl px-3 absolute left-8'>{"<--"}</Button>
            }
            <div className='pr-15 flex flex-row gap-4'>
                <Select value={selectedValue} onValueChange={setSelectedValue}>
                    <SelectTrigger className='bg-bg2 rounded '>
                            <SelectValue placeholder='Module'>
                                <span className=''>{selectedModule?.title.split(":")[0]}</span>
                            </SelectValue>
                    </SelectTrigger>
                    <SelectContent className='rounded'>
                        <SelectGroup className=''>
                            {modules.map((module , index) => (
                                <SelectItem key={index} value={module.id} className=''>
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
                        <SelectGroup className=''>
                            <SelectItem value={"Quiz"} className=''>
                                Quiz
                            </SelectItem>
                            <SelectItem value={"Mission"} className=''>
                                Mission
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            {isNext && 
                <Button onClick={next} className='rounded-4xl px-3 absolute right-8'>{"-->"}</Button>
            }
        </div>
    )
}

