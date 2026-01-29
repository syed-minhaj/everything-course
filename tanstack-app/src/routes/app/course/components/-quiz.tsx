import { useTaskContextValue } from "@/components/taskContextProvider"
import { db } from "@/lib/drizzle"
import { redirect } from "@tanstack/react-router"
import { createServerFn, useServerFn } from "@tanstack/react-start"
import {z} from "zod";
import { useSuspenseQuery } from "@tanstack/react-query"
import { auth } from "@/lib/auth";
import { getRequestHeaders } from "@tanstack/react-start-server";
import { userToQuickQuizzesPassed } from "db/schema";
import { toast } from "sonner";

const getQuiz = createServerFn().inputValidator(z.string()).handler(async ({ data }) => {
    const session = await auth.api.getSession({ headers: getRequestHeaders()});
    
    const task = await db.query.quickQuizzes.findFirst({
        where : (quickQuizzes , {eq}) => eq(quickQuizzes.moduleId , data),
        with : {
            passedUsers : {
                where : (passedUsers , {eq}) => eq(passedUsers.userId , session?.user.id ?? ""),
                columns : {userId : true}
            }
        }
    })
    if (!task) {
        throw redirect({to : "/app/course"})
    };
    if (!session ) {
        return Object.assign(task , {isPassed : false})
    }
    if (task.passedUsers.some((passedUser) => passedUser.userId == session.user.id)) {
        return Object.assign(task , {isPassed : true})
    }
    return Object.assign(task , {isPassed : false})
})


const quizPassed = createServerFn().inputValidator(z.string()).handler(async ({ data }) => {
    const session = await auth.api.getSession({ headers: getRequestHeaders()});
    if (!session) {
        toast.error("Please login to continue")
        return
    }
    await db.insert(userToQuickQuizzesPassed).values({userId : session.user.id , quickQuizId : data})
})

export const Quiz = ({moduleID} : {moduleID : string }) => {

    const {setTask} = useTaskContextValue()
    const qp = useServerFn(quizPassed);
    const q = useSuspenseQuery({
        queryKey: ["quiz" , moduleID],
        queryFn: async() => getQuiz({data : moduleID}),
        gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    })

    const correctAnswer = q.data.answer.toUpperCase().charCodeAt(0) - 64
    function submitAnswer(index : number) {
        if (index === correctAnswer) {
            qp({data : q.data.id})
            setTask("Mission")
            q.refetch()
        } else {
            toast.error("Wrong Answer")
        }
    }
    return (
        <>
        {q.data.isPassed && <div className="absolute w-fit top-5 right-5 p-4 py-2 rounded-full bg-amber-400 font-bold ">Passed</div>}
        <div className="w-4/5 gap-4 mx-auto py-24 flex flex-col  ">
            <h5 className="mb-10">{q.data.question}</h5>
            {q.data.options.map((option , index) => (
                <button onClick={() => submitAnswer(index+1)} className="bg-bg2  border border-black dark:border-gray-200 hover:border-primary 
                hover:border-2 hover:bg-primary/15 hover:text-primary w-4/5 h-20 
                flex justify-center items-center rounded-md mx-auto" key={index}>
                    {option}
                </button>
            ))}
        </div>
        </>
    )
}