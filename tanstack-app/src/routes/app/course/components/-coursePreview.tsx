import { courseTypeDB } from "@/types"
import { Link } from "@tanstack/react-router"
import { course } from ".."


function CoursePreview({course} : {course : course}) {
    return (
        <Link to="/app/course/$courseID" params={{courseID : course.id}} className="bg-bg2 w-full border border-black dark:border-white/50 hover:border-amber-400">
            <div className="w-11/12 mx-auto my-4 flex flex-col gap-4">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex-1">
                        <h3 className=" font-light opacity-50">Course</h3>
                        <h3 className=" font-medium text-2xl">{course.courseTitle}</h3>
                    </div>
                    <span className="opacity-50 w-fit" >0 / {course.no_of_modules}</span>
                </div>
                <p className="md:w-5/6 ">{course.introSummary}</p>
            </div>
        </Link>
    )
}
export default CoursePreview
