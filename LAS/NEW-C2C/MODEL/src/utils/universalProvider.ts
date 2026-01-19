import type { MappingData } from "./excelExport";
import { finalizeMappingData } from "./mappingSanitizer";

export const generateWithUniversal = async (
    apiKey: string,
    prompt: string,
    poDb: any,
    baseUrl: string,
    modelName: string
): Promise<MappingData> => {
    const runRequest = async (useJsonMode: boolean) => {
        // Force the prompt to be JSON-centric if not using system JSON mode
        const finalPrompt = useJsonMode ? prompt : `Strict Rule: Return ONLY a valid JSON object. No preamble, no markdown. JSON:\n${prompt}`;

        const body: any = {
            model: modelName,
            messages: [{ role: "user", content: finalPrompt }],
            temperature: 0,
            max_tokens: 6000
        };

        if (useJsonMode) {
            body.response_format = { type: "json_object" };
        }

        const response = await fetch(baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errBody = await response.json().catch(() => ({}));
            const msg = errBody.error?.message || response.statusText || `HTTP ${response.status}`;
            throw { status: response.status, message: msg };
        }

        return await response.json();
    };

    let data;
    try {
        data = await runRequest(true);
    } catch (err: any) {
        // If 400 (Bad Request) or 422 (Unprocessable), retry without JSON mode
        if (err.status === 400 || err.status === 422) {
            console.warn(`[Universal] ${modelName} rejected JSON mode. Retrying in Safe Mode...`);
            data = await runRequest(false);
        } else {
            throw err;
        }
    }

    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
        throw new Error(`Empty response from ${modelName}`);
    }

    let parsed: any;
    try {
        // 1. Try stripping common AI markdown wrappers
        const cleanedContent = content
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        // 2. Try direct parse
        try {
            parsed = JSON.parse(cleanedContent);
        } catch {
            // 3. Extraction mode: Find the first { and last }
            const firstBrace = cleanedContent.indexOf("{");
            const lastBrace = cleanedContent.lastIndexOf("}");
            if (firstBrace !== -1 && lastBrace !== -1) {
                const jsonStr = cleanedContent.substring(firstBrace, lastBrace + 1);
                parsed = JSON.parse(jsonStr);
            } else {
                throw new Error("No JSON structure found.");
            }
        }
    } catch (e) {
        console.error(`[Universal] Parsing failed for ${modelName}. Content:`, content.substring(0, 100));
        throw new Error(`Data extraction failed for ${modelName}.`);
    }

    // LINK TO GOD-TIER SANITIZER
    return finalizeMappingData(parsed, poDb);
};
