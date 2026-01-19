import Groq from "groq-sdk";
import type { MappingData } from "./excelExport";
import { generateWithUniversal } from "./universalProvider";
import { finalizeMappingData } from "./mappingSanitizer";

export type AIProvider = "groq" | "sambanova" | "openrouter";

// --- CONFIG ---
const FAST_TIMEOUT = 28000;
const DEEP_TIMEOUT = 90000;
const LINEAR_BACKOFF = 5000;

const OPENROUTER_RESCUE_MODELS = [
    "google/gemini-2.0-flash-exp:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "google/gemini-flash-1.5-8b:free",
    "qwen/qwen-2.5-72b-instruct:free",
    "mistralai/mistral-small-24b-instruct-2501:free",
    "google/gemini-2.0-flash-exp:free",
    "meta-llama/llama-3.1-8b-instruct:free",
    "qwen/qwen-2.5-7b-instruct:free",
    "google/gemini-flash-1.5-8b:free",
    "openrouter/auto"
];

export const generateCOPOMapping = async (
    syllabusText: string,
    apiKey?: string,
    provider: AIProvider = "sambanova",
    onStatus?: (status: string) => void
): Promise<MappingData> => {
    // Keys
    const groqKey = apiKey || (import.meta.env.VITE_GROQ_API_KEY as string | undefined);
    const sambaNovaKey = apiKey || (import.meta.env.VITE_SAMBANOVA_API_KEY as string | undefined);
    const openRouterKey = apiKey || (import.meta.env.VITE_OPENROUTER_API_KEY as string | undefined);

    const { PROGRAM_OUTCOMES: poDb } = await import("./poDatabase");

    // "GOD-TIER" HIGH-PRECISION PROMPT (Step 1452 + 1708)
    const prompt = `
  You are an NBA Syllabus Specialist. Your goal is exhaustive extraction and precise lesson planning.
  SYLLABUS DATA: ${syllabusText.substring(0, 16000)}
  PO DATABASE: ${JSON.stringify(poDb.slice(0, 12))}

  ---
  ULTRA-STRICT EXTRACTION RULES (MANDATORY):
  1. SEQUENTIAL BLOCK PROCESSING (CRITICAL):
     - DO NOT process the whole syllabus at once.
     - EXECUTE PRECISELY IN THIS ORDER:
       * Step 1: Read "Unit 1" Header -> Read Declared Hours (e.g. 6 Hours).
       * Step 2: Extract topics for Unit 1.
       * Step 3: Generate EXACTLY 6 rows for Unit 1. (Split topics if needed).
       * Step 4: STOP. Verify count (6 == 6).
       * Step 5: Move to "Unit 2". Repeat.
     - STRICTLY FORBIDDEN: Shifting an hour from Unit 1 to Unit 2.
     - STRICTLY FORBIDDEN: Generating 5 rows for a 6-hour Unit.
  2. UNIT-LEVEL PRECISION:
     - Target: Generated Rows for Unit X MUST EQUAL "Hours Declared for Unit X".
     - Rule: If Unit 1 has 8 Hours but only 3 Topics -> You MUST SPLIT those topics to get 8 rows.
  3. MATH PROOF: in 'planningReasoning', output: "Unit 1 Done (6/6) -> Unit 2 Start (X/X)...".
  4. ZERO-GROUPING (PBL & PRACTICALS): 
     - Capture EVERY individual activity, experiment, or topic listed at the end of the syllabus.
     - If syllabus says "1. Sorting, 2. Searching", create TWO separate rows. NO EXCEPTION.
  5. ASSESSMENTS: For Practicals and PBL, provide a precision 10-word methodology in 'assessment'.
  6. ANTI-PO1: For non-technical/humanities topics, strictly use PO10/PO12. Do NOT use PO1-PO5.
  
  JSON SCHEMA:
  {
    "planningReasoning": "Unit 1 Done (6/6) -> Unit 2 Done (7/7). No Bleeding.",
    "subject": { "name": "string", "code": "string", "credits": number, "totalHours": number, "theoryHours": number, "practicalHours": number, "pblHours": number },
    "courseOutcomes": [ { "id": "CO1", "description": "string", "hours": number } ],
    "lectures": [ { "lectureNo": number, "unit": "string", "topic": "string", "hours": 1, "co": "string", "pos": ["PO1"] } ],
    "practicals": [ { "practicalNo": "string", "name": "string", "hours": number, "mappedCOs": ["CO1"], "mappedPOs": ["PO1", "PO2"], "assessment": "10-word method" } ],
    "pblActivities": [ { "activityNo": "string", "name": "string", "hours": number, "mappedCOs": ["CO1"], "mappedPOs": ["PO1", "PO2"], "assessment": "10-word method" } ],
    "coPoMapping": { "CO1": ["PO1", "PO2"] },
    "justifications": { "CO1-PO1": "Justification string" }
  }`;

    const withTimeout = (promise: Promise<any>, ms: number, label: string) => {
        let tid: any;
        const tp = new Promise((_, r) => (tid = setTimeout(() => r(new Error(`${label} Timeout`)), ms)));
        return Promise.race([promise, tp]).finally(() => clearTimeout(tid));
    };

    const runOpenRouterRescue = async (): Promise<MappingData> => {
        if (!openRouterKey || openRouterKey.length < 5) {
            throw new Error("OpenRouter API key is missing or invalid.");
        }
        onStatus?.("Rescue Hub: Starting Sequential Cycle...");
        let lastErr: any = null;
        for (const [idx, model] of OPENROUTER_RESCUE_MODELS.entries()) {
            try {
                const modelLabel = model.split('/')[1]?.split(':')[0] || model;
                onStatus?.(`Rescue Hub [${idx + 1}/10]: ${modelLabel}...`);
                return await withTimeout(
                    generateWithUniversal(openRouterKey, prompt, poDb, "https://openrouter.ai/api/v1/chat/completions", model),
                    DEEP_TIMEOUT,
                    model
                );
            } catch (err: any) {
                lastErr = err;
                console.warn(`[Resilience Hub] OR Node ${model} failed:`, err.message || err);
                onStatus?.(`${model.split('/')[1]?.split(':')[0] || 'Node'} busy. Cycling...`);
                await new Promise(res => setTimeout(res, LINEAR_BACKOFF));
            }
        }
        throw lastErr || new Error("All backup providers exhausted.");
    };

    const runSambaNovaTier = async (): Promise<MappingData> => {
        if (!sambaNovaKey || sambaNovaKey.length < 5) {
            onStatus?.("Samba Key Missing. Using Rescue Hub...");
            return await runOpenRouterRescue();
        }
        try {
            onStatus?.("SambaNova Hub [Dedicated]: Running...");
            return await withTimeout(
                generateWithUniversal(sambaNovaKey, prompt, poDb, "https://api.sambanova.ai/v1/chat/completions", "Meta-Llama-3.3-70B-Instruct"),
                DEEP_TIMEOUT,
                "SambaNova"
            );
        } catch (err: any) {
            console.error("[Resilience Hub] SambaNova Tier failed:", err.message || err);
            onStatus?.("SambaNova busy. Moving to rescue hub...");
            return await runOpenRouterRescue();
        }
    };

    // --- MAIN HUB LOGIC ---
    try {
        if (provider === "openrouter") return await runOpenRouterRescue();

        // Default SambaNova
        try {
            onStatus?.("AI Hub: SambaNova Primary active...");
            return await runSambaNovaTier();
        } catch (err: any) {
            console.warn(`[Resilience Hub] SambaNova failed:`, err.message || err);
            onStatus?.("SambaNova busy. Engaging backups...");
            return await runOpenRouterRescue();
        }
    } catch (error: any) {
        console.error("FATAL: All Resilience Systems are down:", error);
        throw new Error(`⚠️ System Overloaded. Details: ${error.message || "Unknown Failure"}`);
    }
};
