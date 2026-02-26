import { z } from "better-auth"
import { courseSchema } from "./lib/gemini"

type courseType = z.infer<typeof courseSchema>;

type courseTypeDB =   {
    id: string;
    courseTitle: string;
    introSummary: string;
    modules: moduleType[];
}

type moduleType = {
    id: string;
    title: string;
    courseId: number;
    conceptualDeepDive: string;
    resources: resourceType[];
    missions: missionType[];
    quizzes: quizeType[];
}

type quizeType = {
    id: string;
    moduleId: number;
    question: string;
    options: string[];
    answer: string;
}

type missionType = {
    id: string;
    title: string;
    moduleId: number;
    instructions: string;
    rubric: string[];
}

type resourceType = {
    id: string;
    title: string;
    moduleId: number;
    type: string;
    url: string;
}

export type {courseType , courseTypeDB , moduleType , quizeType , missionType , resourceType}