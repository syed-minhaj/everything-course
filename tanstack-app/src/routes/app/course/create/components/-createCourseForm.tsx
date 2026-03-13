import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { generateCourse } from "@/server/course";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Link, useNavigate } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoaderCircle } from "lucide-react";

export interface DiscoveryData {
    topic: string;
    userContext: string;
    depthLevel: typeof DEPTH_LABELS[number];
}

const DEPTH_LABELS = ["Surface Level", "Standard", "Deep Dive", "Academic"] as const;

export default function CreateCourseForm() {
    const a  = useServerFn(generateCourse)
    const navigate = useNavigate()
    const [creatingCourse, setCreatingCourse] = useState(false)
    const [course, setCourse] = useState<{id : string , title : string}|null>(null)
    const [values, setValues] = useState<DiscoveryData>({
        topic: "",
        userContext: "",
        depthLevel: "Standard",
    });

    const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues((prev) => ({ ...prev, topic: e.target.value }));
    };

    const handleContextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValues((prev) => ({ ...prev, userContext: e.target.value }));
    };

    const handleSliderChange = (val: number[]) => {
        setValues((prev) => ({ ...prev, depthLevel: DEPTH_LABELS[val[0]] }));
    };

    const handleNext = async() => {
        setCreatingCourse(true)
        const { error , course } = await a({data : values})
        if (error) { 
            if (error == "Not logged in") {
                navigate({to : "/app/auth/$authView" , params : {authView : "login"}})
            }
            toast.error(error) 
        }
        if (course) setCourse(course)
        
        setCreatingCourse(false)
        setValues({
            topic: "",
            userContext: "",
            depthLevel: "Standard",
        })
     };

    return (
        <div  className="w-full md:w-5/6 md:mt-12 p-6 space-y-8   ">
            <Dialog open={creatingCourse || (course ? true : false)}  >
                <DialogContent className="flex flex-col items-center justify-center border-2 bg-bg2" 
                    showCloseButton={(course ? true : false)} onDialogClose={() => {setCourse(null)}}>
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            {course ? "Course Created" : "Creating Course"}
                        </DialogTitle>
                    </DialogHeader>

                    {course ? 
                        <div>
                            <h2 className="text-lg pb-4 text-center ">{course.title}</h2>
                            <Link to="/app/course/$courseID" params={{courseID: course.id}} className="mt-4 text-center">
                                <Button variant="outline" className="w-full">
                                    View Course
                                </Button>
                            </Link>
                        </div>
                    :
                        <div>Could take a minute or so. Please wait...</div>
                    }
                    {!course && 
                        <LoaderCircle className="animate-spin " size={80} strokeWidth={0.5} /> 
                    }
                </DialogContent>
            </Dialog>
            {/* Topic Field */}
            <div className="space-y-2">
                <Label htmlFor="topic" className="text-sm font-semibold tracking-tight">
                    Topic
                </Label>
                <Input
                    disabled={creatingCourse}
                    id="topic"
                    placeholder="e.g., Quantum Entanglement"
                    value={values.topic}
                    onChange={handleTopicChange}
                    className="focus-visible:ring-1 "
                />
            </div>

            {/* User Context Field */}
            <div className="space-y-2">
                <Label htmlFor="context" className="text-sm font-semibold tracking-tight">
                    User Context
                </Label>
                <Textarea
                    disabled={creatingCourse}
                    id="context"
                    placeholder="Briefly describe your current knowledge or objective..."
                    value={values.userContext}
                    onChange={handleContextChange}
                    className="min-h-[120px] resize-none"
                />
            </div>

            {/* Depth Level Field */}
            <div className="space-y-4 w-md max-w-full">
                <div className="flex justify-between items-end">
                    <Label className="text-sm font-semibold tracking-tight">
                        Depth Level
                    </Label>
                    <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded text-secondary-foreground">
                        {values.depthLevel}
                    </span>
                </div>
                <div className="px-1">
                    <Slider
                        disabled={creatingCourse}
                        defaultValue={[1]}
                        max={3}
                        step={1}
                        onValueChange={handleSliderChange}
                        aria-label="Depth selection slider"
                    />
                </div>
                <div className="flex justify-between w-full px-1 text-[10px] uppercase font-medium text-muted-foreground tracking-widest">
                    <span>Intro</span>
                    <span>Expert</span>
                </div>
            </div>

            {/* Action Area */}
            <div className="pt-4 flex justify-end">
                <Button 
                    disabled={creatingCourse}
                    onClick={handleNext} 
                    className="px-8 font-semibold"
                >
                    Create
                </Button>
            </div>

            
        </div>
    );
}