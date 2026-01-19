import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateWithGemini = async (
    syllabusText,
    apiKey,
    prompt,
    poDb
) => {
    // Explicitly use 'v1' for better stability in some regions
    const genAI = new GoogleGenerativeAI(apiKey);

    // Comprehensive Model Fallback (Standard Names)
    const modelsToTry = [
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-1.0-pro"
    ];

    let lastError = null;

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

            let parsed;
            try {
                parsed = JSON.parse(content);
            } catch (e) {
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
                else throw new Error("Gemini failed to return valid JSON. Response was: " + content.substring(0, 100));
            }

            return sanitizeGeminiResponse(parsed, poDb);
        } catch (err) {
            lastError = err;
            console.warn(`[Gemini Engine] ${modelName} failed:`, err.message);
        }
    }

    throw lastError || new Error("All Gemini models failed");
};

function sanitizeGeminiResponse(parsed, poDb) {
    // Similar to finalizeMappingData but Gemini-specific
    const validPOs = poDb.slice(0, 12).map((p) => ({
        id: p.id,
        description: p.description
    }));

    return {
        subject: {
            code: parsed.subject?.code || "N/A",
            name: parsed.subject?.name || "Subject Name",
            credits: Number(parsed.subject?.credits) || 3,
            semester: Number(parsed.subject?.semester) || 1,
            totalHours: Number(parsed.subject?.totalHours) || 45,
            theoryHours: Number(parsed.subject?.theoryHours) || 0,
            practicalHours: Number(parsed.subject?.practicalHours) || 0,
            pblHours: Number(parsed.subject?.pblHours) || 0
        },
        courseOutcomes: (Array.isArray(parsed.courseOutcomes) ? parsed.courseOutcomes : []).map((co) => ({
            id: co.id || `CO${parsed.courseOutcomes.indexOf(co) + 1}`,
            description: co.description || "Outcome description",
            rbtLevel: co.rbtLevel || "L3",
            hours: Number(co.hours) || 0
        })),
        programOutcomes: validPOs,
        lectures: (Array.isArray(parsed.lectures) ? parsed.lectures : []).map((l, i) => ({
            lectureNo: Number(l.lectureNo) || (i + 1),
            unit: l.unit || "Unit 1",
            topic: l.topic || "Topic",
            hours: Number(l.hours) || 1,
            co: l.co || "CO1",
            pos: Array.isArray(l.pos) ? l.pos : []
        })),
        practicals: (Array.isArray(parsed.practicals) ? parsed.practicals : []).map((p, i) => ({
            practicalNo: p.practicalNo || (i + 1).toString(),
            name: p.name || "Practical",
            hours: Number(p.hours) || 2,
            mappedCOs: Array.isArray(p.mappedCOs) ? p.mappedCOs : [],
            mappedPOs: Array.isArray(p.mappedPOs) ? p.mappedPOs : [],
            assessment: p.assessment || "Performance & Viva"
        })),
        pblActivities: (Array.isArray(parsed.pblActivities) ? parsed.pblActivities : []).map((pbl, i) => ({
            activityNo: pbl.activityNo || `A${i + 1}`,
            name: pbl.name || "PBL Activity",
            hours: Number(pbl.hours) || 1,
            mappedCOs: Array.isArray(pbl.mappedCOs) ? pbl.mappedCOs : [],
            mappedPOs: Array.isArray(pbl.mappedPOs) ? pbl.mappedPOs : [],
            assessment: pbl.assessment || "Report & Peer-Review"
        })),
        coPoMapping: parsed.coPoMapping || {},
        justifications: parsed.justifications || {}
    };
}