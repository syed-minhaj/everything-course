"use server";
import { GoogleGenAI, ApiError } from "@google/genai";
import { courseType } from "@/types";
import {z} from "zod"
import { getOtherUrl, getYoutubeTop10Result} from "./resourseURL";

export const courseSchema = z.object({
    "course_title": z.string(),
    "intro_summary": z.string(),
    "modules": z.array(z.object({
        "title": z.string(),
        "conceptual_deep_dive": z.string(),
        "external_resources": z.array(z.object({
            "type": z.enum(["article", "youtube video", "podcast"]),
            "title": z.string(),
            "url": z.string()
        })),
        "assessment": z.object({
            "primary_mission": z.object({
                "title": z.string(),
                "instructions": z.string(),
                "rubric": z.array(z.string())
            }),
            "quick_quiz": z.array(z.object({
                "question": z.string(),
                "options": z.array(z.string()),
                "answer": z.string()
            }))
        })
    }))
})

type CourseParams = {
    topic: string;
    userContext: string;
    depthLevel: string;
};

const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GENAI_API_KEY, 
});

function buildPrompt({ topic, userContext, depthLevel }: CourseParams): string {
    return `
You are a Universal Course Architect. Design a detailed learning path for the following request.
User Request:
- Topic: ${topic}
- Context/Goal: ${userContext}
- Detail Level: ${depthLevel}

Directives:
1. Variable Structure: Decide the number of modules based on the topic.
2. Course should be large and detailed enough to cover user's goal.
3. Detailed Content: Provide deep explanations, not just headings.
4. Verified Links: Use Google Search to find real working URLs .
5. Use Google Search to find REAL.
6. For youtube video resources, call the searchYoutube tool with a relevant query. 
   From the results, pick the best matching video based on title discription relevance to the module topic.
   Use the video id to set the url as: https://www.youtube.com/embed/{id}
7. Include good mix of articles and youtube videos.
8. Conceptual deep dives must be detailed (10 words).
9. Modules should be named as "Module [no]: [module Title]"
10. Hybrid Assessment (90/10 Split):
   - PRIMARY: Practical Mission
   - SECONDARY: Quick Check (1 MCQs)

Output Format: Return valid JSON only. Schema:
{
    "course_title": "string",
    "intro_summary": "string",
    "modules": [
        {
            "title": "string",
            "conceptual_deep_dive": "10 words explaining the core theory of this module in detail.",
            "external_resources": { "type": "article|youtube video|podcast", "title": "string", "url": "string" }[],
            "assessment": {
                "primary_mission": {
                    "title": "The main task",
                    "instructions": "Step-by-step instructions.",
                    "rubric": ["Criteria 1", "Criteria 2", "Criteria 3"]
                },
                "quick_quiz": [
                    { "question": "string", "options": ["A", "B", "C"], "answer": "A" } // answer will be of one char 'A', 'B', 'C', 'D'
                ]
            }
        }
    ]
}
Only include YouTube URLs that are publicly playable videos.
Do not include channels, shorts, or playlists.
If unsure, omit the video.

Return only the JSON. No extra commentary.
`;
}


function safeParseJson(text: string): any {
    text = text.trim();
    try {
        return JSON.parse(text);
    } catch {
        // try to extract JSON object/block from within text
        const match = text.match(/(\{[\s\S]*\})/m);
        if (match && match[1]) {
            try {
                return JSON.parse(match[1]);
            } catch (e) {
                throw new Error("Failed to parse JSON from model output.");
            }
        }
        throw new Error("No JSON found in model output.");
    }
}


async function generateGeneralCourse(params: CourseParams): Promise<courseType> {
    const prompt = buildPrompt(params);

    try {
        const courseResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: { temperature: 0.2 },
        });

        if (!courseResponse.text) throw new Error('No response text');

        const json = safeParseJson(courseResponse.text);
        const parsed = courseSchema.safeParse(json);
        if (!parsed.success) throw new Error('Failed to parse JSON');

        const course: courseType = parsed.data;

        type VideoRef = {
            moduleIdx: number;
            resIdx: number;
            title: string;
            results: Awaited<ReturnType<typeof getYoutubeTop10Result>>;
        };

        const searchPromises: Promise<VideoRef>[] = [];

        for (let moduleIdx = 0; moduleIdx < course.modules.length; moduleIdx++) {
            const module = course.modules[moduleIdx];
            for (let resIdx = 0; resIdx < module.external_resources.length; resIdx++) {
                const res = module.external_resources[resIdx];
                if (res.type !== 'youtube video') continue;

                searchPromises.push(
                    getYoutubeTop10Result({ title: res.title }).then((results) => ({
                        moduleIdx,
                        resIdx,
                        title: res.title,
                        results,
                    }))
                );
            }
        }

        const allSearchResults = await Promise.all(searchPromises);

        const selectionPrompt = `
            You previously generated this course:
            ${JSON.stringify(course, null, 2)}

            For each YouTube video resource, I searched YouTube and got these results.
            Pick the single best video for each based on relevance to the module topic.

            Search Results:
            ${JSON.stringify(
                allSearchResults.map((s) => ({
                    moduleIdx: s.moduleIdx,
                    resIdx: s.resIdx,
                    originalTitle: s.title,
                    results: s.results,
                })),
                null,
                2
            )}

            Return a JSON array only. Each item: { "moduleIdx": number, "resIdx": number, "id": string, "title": string }
            So your return type should be: 
            {"moduleIdx": number, "resIdx": number, "id": string, "title": string}[]
            No extra commentary.
            `;

        const selectionResponse = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-preview',
            contents: selectionPrompt,
            config: { temperature: 0.1 },
        });

        if (!selectionResponse.text) throw new Error('No selection response text');

        const selections: { moduleIdx: number; resIdx: number; id: string; title: string }[] =
            safeParseJson(selectionResponse.text);

        for (const sel of selections) {
            const res = course.modules[sel.moduleIdx].external_resources[sel.resIdx];
            res.title = sel.title;
            res.url = `https://www.youtube.com/embed/${sel.id}`;
        }

        await Promise.all(
            course.modules.map(async (module) => {
                const validatedResources = [];
                for (const res of module.external_resources) {
                    if (res.type !== 'youtube video') {
                        const otherRes = await getOtherUrl({ url: res.url });
                        if (!otherRes) continue;
                        res.url = otherRes;
                    }
                    validatedResources.push(res);
                }
                module.external_resources = validatedResources;
            })
        );

        return course;

    } catch (err: unknown) {
        if (err instanceof ApiError) {
            throw new Error(`GenAI ApiError: ${err.name} ${err.status} ${err.message}`);
        }
        throw err as Error;
    }
}

async function main({course} : {course : CourseParams}) : Promise<{success : true , course : courseType} | {success : false , course : null}> {
   
    try {
        const result = await generateGeneralCourse(course);
        return {success : true , course : result}
    } catch (e) {
        console.error("Generate error:", e);
        return {success : false , course : null}
    }
}

export {main as geminiGenerator}
