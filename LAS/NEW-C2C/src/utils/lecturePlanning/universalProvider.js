import { finalizeMappingData } from "./mappingSanitizer";

export const generateWithUniversal = async (
    apiKey,
    prompt,
    poDb,
    baseUrl,
    modelName
) => {
    const runRequest = async (useJsonMode) => {
        // Force the prompt to be JSON-centric if not using system JSON mode
        const finalPrompt = useJsonMode ? prompt : `Strict Rule: Return ONLY a valid JSON object. No preamble, no markdown. JSON:\n${prompt}`;

        const body = {
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
    } catch (err) {
        // If 400 (Bad Request) or 422 (Unprocessable), retry without JSON mode
        if (err.status === 400 || err.status === 422) {
            console.warn(`[Universal] ${modelName} rejected JSON mode. Retrying in Safe Mode...`);
            data = await runRequest(false);
        } else {
            throw err;
        }
    }

    const content = data.choices?.[0]?.message?.content || data.response || data.content;
    if (!content) throw new Error("Empty response from API");

    let parsed;
    try {
        parsed = JSON.parse(content);
    } catch (e) {
        // Try to extract JSON from markdown or text
        const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) ||
                         content.match(/(\{[\s\S]*\})/);
        if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[1]);
        } else {
            throw new Error(`Failed to parse JSON response: ${content.substring(0, 200)}`);
        }
    }

    return parsed;
};