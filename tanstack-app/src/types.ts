import { z } from "better-auth"
import { courseSchema } from "./lib/gemini"

type courseType = z.infer<typeof courseSchema>;

type courseTypeDB =   {
    id: string;
    courseTitle: string;
    introSummary: string;
    chapters: chapterType[];
}

type chapterType = {
    id: string;
    courseId: string;
    title: string;
    order: number;
    modules: moduleType[];
}

type moduleType = {
    id: string;
    title: string;
    courseId: string;
    chapterId: string | null;
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

export type {courseType , courseTypeDB , chapterType , moduleType , quizeType , missionType , resourceType}