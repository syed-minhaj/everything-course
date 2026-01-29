"use server";
import { GoogleGenAI, ApiError } from "@google/genai";
import { courseType } from "@/types";
import {z} from "zod"

export const courseSchema = z.object({
    "course_title": z.string(),
    "intro_summary": z.string(),
    "modules": z.array(z.object({
        "title": z.string(),
        "conceptual_deep_dive": z.string(),
        "external_resources": z.array(z.object({
            "type": z.string(),
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
You are a Universal Course Architect. Design a learning path for the following request.
User Request:
- Topic: ${topic}
- Context/Goal: ${userContext}
- Detail Level: ${depthLevel}

Directives:
1. Variable Structure: Decide the number of modules based on the topic.
2. Detailed Content: Provide deep explanations, not just headings.
3. Verified Links: Use Google Search to find real working URLs , videos should only be youtube embed.
4. Use Google Search to find REAL, functioning YouTube videos for the topic.
5. MANDATORY: YouTube URLs MUST be in embed format: https://www.youtube.com/embed/[VIDEO_ID]..
6. Do not invent video IDs; they must be real results.
7. Conceptual deep dives must be detailed (10 words).
8. Hybrid Assessment (90/10 Split):
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
            "external_resources": [
                { "type": "article|youtube video(in embed form)|podcast", "title": "string", "url": "string" }
            ],
            "assessment": {
                "primary_mission": {
                    "title": "The main task",
                    "instructions": "Step-by-step instructions.",
                    "rubric": ["Criteria 1", "Criteria 2", "Criteria 3"]
                },
                "quick_quiz": [
                    { "question": "string", "options": ["A", "B", "C"], "answer": "A" }
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


async function generateGeneralCourse(
    params: CourseParams
): Promise<courseType> {
    const prompt = buildPrompt(params);

    const groundingTool = {
        googleSearch: {},
    };

    try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    temperature: 0.3,
                    tools: [groundingTool],
                },
            });
            if (!response.text) {
                throw new Error("No response text")
            }
            const json : courseType = safeParseJson(response.text);
            const parsed = courseSchema.safeParse(json)
            if (!parsed.success) {
                throw new Error("Failed to parse JSON")
            }
            return json
        
    } catch (err: unknown) {
        if (err instanceof ApiError) {
            // structured API error from SDK
            throw new Error(
                //`GenAI ApiError: ${err.name} ${err.status} ${err.message}`
            );
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

