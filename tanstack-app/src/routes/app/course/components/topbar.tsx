import { useTaskContextValue } from '@/components/taskContextProvider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger , SelectGroup, SelectValue } from '@/components/ui/select'
import { redirect, Route, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

type moduleType = {
    id: string;
    courseId: string;
    title: string;
    conceptualDeepDive: string;
}

export default function Topbar({modules , moduleID} : {modules : moduleType[] , moduleID : string}) {

    const [selectedValue, setSelectedValue] = useState<string>(moduleID)
    const selectedModule = modules.find((m) => m.id === selectedValue)
    const {task ,setTask} = useTaskContextValue()
    const navigate = useNavigate()
 
    useEffect(() => {
        if (!selectedModule) return
        if (selectedModule.id === moduleID) return
        navigate({to : "/app/course/$courseID/$moduleID" , reloadDocument: true , params : {courseID : selectedModule.courseId , moduleID : selectedModule.id}})
    }, [selectedValue])

    function next() {
        if (task === "Quiz") {
            setTask("Mission")
        } else {
            const lastModule = modules[modules.length - 1]
            if (moduleID === lastModule.id) {
                navigate({to : "/app/course"})
                return
            }
            navigate({to : "/app/course/$courseID/$moduleID" 
                , reloadDocument: true , params : {courseID : modules[0].courseId , moduleID : String(Number(moduleID) + 1) }
            })
        }
    }

    return (
        <div className='h-12 flex flex-row items-center justify-end gap-4 px-8 '>
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
            <Button onClick={next} className='rounded-4xl px-3'>{"-->"}</Button>
        </div>
    )
}

