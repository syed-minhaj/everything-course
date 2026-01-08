import { useTaskContextValue } from "@/components/taskContextProvider"
import { db } from "@/lib/drizzle"
import { redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import {z} from "zod";
import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const getQuiz = createServerFn().inputValidator(z.string()).handler(async ({ data }) => {
    const task = await db.query.quickQuizzes.findFirst({
        where : (quickQuizzes , {eq}) => eq(quickQuizzes.moduleId , data),
    })
    if (!task) {
        throw redirect({to : "/app/course"})
    };
    return task
})

const getMession = createServerFn().inputValidator(z.string()).handler(async ({ data }) => {
    const task = await db.query.primaryMissions.findFirst({
        where : (messions , {eq}) => eq(messions.moduleId , data),
    })
    if (!task) {
        throw redirect({to : "/app/course"})
    };
    return task
})

const Quiz = ({moduleID} : {moduleID : string }) => {

    const q = useSuspenseQuery({
        queryKey: ["quiz" , moduleID],
        queryFn: async() => getQuiz({data : moduleID}),
        gcTime: 1000 * 60 * 60 * 24 * 7,
    })
    // convert answer from A to 1 , B to 2 , C to 3 , D to 4

    const correctAnswer = q.data.answer.toUpperCase().charCodeAt(0) - 64
    function submitAnswer(index : number) {
        if (index === correctAnswer) {
            alert("Correct Answer")
        } else {
            alert("Wrong Answer")
        }
    }
    return (
        <div className="w-4/5 gap-4 mx-auto mt-24 flex flex-col ">
            <h5 className="mb-10">{q.data.question}</h5>
            {q.data.options.map((option , index) => (
                <button onClick={() => submitAnswer(index+1)} className="bg-bg2  border border-black hover:border-primary 
                hover:border-2 hover:bg-primary/15 hover:text-primary w-4/5 h-20 
                flex justify-center items-center rounded-md mx-auto" key={index}>
                    {option}
                </button>
            ))}
        </div>
    )
}

const Mission = ({moduleID} : {moduleID : string }) => {
    const m = useSuspenseQuery({
        queryKey: ["mission" , moduleID],
        queryFn: async() => getMession({data : moduleID}),
        gcTime: 1000 * 60 * 60 * 24 * 7,
    })
    
    return (
        <div className="w-4/5 gap-6 mx-auto my-16 flex flex-col ">
            <h5 className="font-medium text-xl">{m.data.title}</h5>
            <p className="text-lg opacity-85">{m.data.instructions}</p>
            <label className="text-lg font-medium">Tasks :</label>
            {m.data.rubric.map((item , index) => (
                <div className="flex items-center space-x-3">
                    <Checkbox 
                        id={`terms-${index}`}
                    />
                    <Label htmlFor={`terms-${index}`} >
                        {item}
                    </Label>
                </div>
            ))}
        </div>
    )
}


export default function Task({moduleID} : {moduleID : string }) {
    const {task} = useTaskContextValue()
    
    
    return (
        <div className="flex-1">
            {task == "Quiz"  ? 
                <Suspense fallback={<div>Loading...</div>}>
                    <Quiz moduleID={moduleID} />
                </Suspense>
            : 
                <Suspense fallback={<div>Loading...</div>}>
                    <Mission moduleID={moduleID} />
                </Suspense>
            }
        </div>
    )
}
