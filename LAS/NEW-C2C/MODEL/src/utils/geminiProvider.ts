import { GoogleGenerativeAI } from "@google/generative-ai";
import type { MappingData } from "./excelExport";

export const generateWithGemini = async (
    syllabusText: string,
    apiKey: string,
    prompt: string,
    poDb: any
): Promise<MappingData> => {
    // Explicitly use 'v1' for better stability in some regions
    const genAI = new GoogleGenerativeAI(apiKey);

    // Comprehensive Model Fallback (Standard Names)
    const modelsToTry = [
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-1.0-pro"
    ];

    let lastError: any = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`[Gemini Engine] Attempting: ${modelName}`);
            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.1
                }
            });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const content = response.text();

            if (!content) throw new Error("Empty response from Gemini");

            let parsed: any;
            try {
                parsed = JSON.parse(content);
            } catch (e) {
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
                else throw new Error("Gemini failed to return valid JSON. Response was: " + content.substring(0, 100));
            }

            return sanitizeGeminiResponse(parsed, poDb);
        } catch (err: any) {
            lastError = err;
            console.error(`[Gemini Error] ${modelName}:`, err.message);

            // If it's 404, we try next. If it's 403 (Permission), it's a key/region issue.
            if (err.message.includes("403")) {
                throw new Error("Gemini Permission Denied (403). \n\n" +
                    "1. Check if 'Generative Language API' is enabled for this project.\n" +
                    "2. Ensure you are using a key from aistudio.google.com.");
            }
            if (!err.message.includes("404")) break;
        }
    }

    if (lastError?.message?.includes("404")) {
        throw new Error("Gemini Model Not Found (404). \n\n" +
            "TIP: Please perform a HARD REFRESH (Ctrl + F5) in your browser. \n" +
            "Your browser is running an old version of the code.");
    }
    throw lastError;
};

const sanitizeGeminiResponse = (parsed: any, poDb: any): MappingData => {
    const filteredPOs = poDb
        .filter((po: any) => parseInt(po.id.replace("PO", "")) <= 11)
        .map((po: any) => ({ id: po.id, description: po.description }));

    return {
        subject: {
            code: parsed.subject?.code || "Unknown",
            name: parsed.subject?.name || "Unknown Subject",
            credits: Number(parsed.subject?.credits) || 3,
            semester: Number(parsed.subject?.semester) || 1,
            theoryHours: Number(parsed.subject?.theoryHours) || 0,
            practicalHours: Number(parsed.subject?.practicalHours) || 0,
            pblHours: Number(parsed.subject?.pblHours) || 0,
            totalHours: Number(parsed.subject?.theoryHours || 0) +
                Number(parsed.subject?.practicalHours || 0) +
                Number(parsed.subject?.pblHours || 0)
        },
        courseOutcomes: Array.isArray(parsed.courseOutcomes) ? parsed.courseOutcomes : [],
        programOutcomes: filteredPOs,
        lectures: (Array.isArray(parsed.lectures) ? parsed.lectures : []).map((l: any, idx: number) => ({
            ...l,
            lectureNo: l.lectureNo || (idx + 1)
        })),
        practicals: (Array.isArray(parsed.practicals) ? parsed.practicals : []).map((p: any) => ({
            ...p,
            mappedPOs: []
        })),
        pblActivities: (Array.isArray(parsed.pblActivities) ? parsed.pblActivities : []).map((p: any) => ({
            ...p,
            mappedPOs: []
        })),
        coPoMapping: parsed.coPoMapping || {},
        justifications: parsed.justifications || {}
    };
};
