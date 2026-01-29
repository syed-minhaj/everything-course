import { useTaskContextValue } from "@/components/taskContextProvider"
import { Suspense } from "react";
import { Quiz } from './-quiz'
import { Mission } from './-mission'



export default function Task({moduleID } : {moduleID : string }) {
    const {task} = useTaskContextValue()
    
    
    return (
        <div className="flex-1 h-full">
            <div className="relative">
                {task == "Quiz"  ? 
                    <Suspense fallback={<div></div>}>
                        <Quiz moduleID={moduleID} />
                    </Suspense>
                : 
                    <Suspense fallback={<div></div>}>
                        <Mission moduleID={moduleID} />
                    </Suspense>
                }
            </div>
        </div>
    )
}
