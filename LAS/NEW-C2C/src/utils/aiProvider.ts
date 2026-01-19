import Groq from "groq-sdk";
import type { MappingData } from "./excelExport";
import { generateWithUniversal } from "./universalProvider";
import { finalizeMappingData } from "./mappingSanitizer";

export type AIProvider = "groq" | "sambanova" | "openrouter";

// --- CONFIG ---
const FAST_TIMEOUT = 28000;
const DEEP_TIMEOUT = 90000;
const LINEAR_BACKOFF = 10000;  // Increased from 5000 to 10000ms

const OPENROUTER_RESCUE_MODELS = [
    "anthropic/claude-3-haiku:beta",
    "meta-llama/llama-3.1-8b-instruct:free",
    "microsoft/wizardlm-2-8x22b:free",
    "mistralai/mistral-7b-instruct:free",
    "openrouter/auto"
];

/**
 * PHASE 1: DISCOVERY PROMPT
 * Extracting metadata and unit structure.
 */
const getDiscoveryPrompt = (syllabusText: string, poDb: any) => `
You are an NBA Accreditation Specialist. Analyze this syllabus and extract the core structure and mapping.
SYLLABUS DATA: ${syllabusText.substring(0, 16000)}
PO DATABASE: ${JSON.stringify(poDb.slice(0, 12))}

---
CO-PO MAPPING RULES (STRICT):
1. NO DEFAULT PO1: Do NOT map PO1 (Engineering Knowledge) to every CO. Only map it if the CO explicitly requires the application of math, science, or engineering fundamentals.
2. SELECTIVITY: Each CO should typically map to 2-4 POs maximum. Mapping to 10+ POs is highly discouraged and usually incorrect.
3. ALIGNMENT: 
   - If CO is about "Analysis/Identification", map to PO2.
   - If CO is about "Design/Development", map to PO3.
   - If CO is about "Experiments/Testing", map to PO4.
   - If CO is about "Tools/Software", map to PO5.
   - If CO is about "Society/Safety", map to PO6.
   - If CO is about "Ethics", map to PO8.
   - If CO is about "Teamwork", map to PO9.
   - If CO is about "Communication/Reports", map to PO10.
4. JUSTIFICATION: Provide a professional, evidence-based justification for EACH mapping (e.g., "CO1 requires students to calculate [X], which aligns with PO1's mathematical modeling competency").

Return ONLY a JSON object with:
{
  "subject": { "name": "string", "code": "string", "credits": number, "totalHours": number, "theoryHours": number, "practicalHours": number, "pblHours": number },
  "courseOutcomes": [ { "id": "CO1", "description": "string", "hours": number } ],
  "units": [ 
    { "unitNo": 1, "title": "Unit Title", "hours": number, "topics": "Comma separated topics for this unit" } 
  ],
  "practicals": [ { "practicalNo": "1", "name": "string", "hours": number, "mappedCOs": ["CO1"], "mappedPOs": ["PO1"], "assessment": "10-word method" } ],
  "pblActivities": [ { "activityNo": "1", "name": "string", "hours": number, "mappedCOs": ["CO1"], "mappedPOs": ["PO1"], "assessment": "10-word method" } ],
  "coPoMapping": { "CO1": ["POx", "POy"] },
  "justifications": { "CO1-POx": "Specific alignment reasoning" }
}`;

/**
 * PHASE 2: UNIT PLANNING PROMPT
 * Generating lectures for a specific unit.
 */


const getUnitPlanningPrompt = (unit: any, cos: any, poDb: any) => `
You are an Academic Planner. Generate a detailed lecture-by-lecture plan for Unit ${unit.unitNo}: ${unit.title}.
Hours Allotted for this Unit: ${unit.hours}.
Topics to cover: ${unit.topics}.
Available Course Outcomes (COs): ${JSON.stringify(cos)}
PO Database: ${JSON.stringify(poDb.slice(0, 12))}

---
STRICT RULES:
1. QUANTITY: You MUST generate EXACTLY ${unit.hours} lecture rows. 
2. MAPPING: For each lecture, identify the most relevant POs from the database. Do NOT simply map everything to PO1.
3. SELECTIVITY: Map each lecture to 1-3 highly relevant POs only.

Return ONLY a JSON array of lectures (no wrapper object):
[
  { 
    "lectureNo": number,
    "unit": "${unit.unitNo}", 
    "topic": "Specific topic detail", 
    "hours": 1, 
    "co": "CO ID (e.g. CO1)", 
    "pos": ["POx", "POy"] 
  }
]`;

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

    // If user selected SambaNova but no custom key, switch to Groq to avoid rate limits
    // if (provider === "sambanova" && !apiKey) {
    //     provider = "groq";
    // }

    const { PROGRAM_OUTCOMES: poDb } = await import("./poDatabase");

    const withTimeout = (promise: Promise<any>, ms: number, label: string) => {
        let tid: any;
        const tp = new Promise((_, r) => (tid = setTimeout(() => r(new Error(`${label} Timeout`)), ms)));
        return Promise.race([promise, tp]).finally(() => clearTimeout(tid));
    };

    /**
     * Executes the AI call with full resilience
     */
    const executeResilientAI = async (currentPrompt: string, statusPrefix: string): Promise<any> => {
        const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

        const runOpenRouterRescue = async (): Promise<any> => {
            if (!openRouterKey || openRouterKey.length < 5) {
                throw new Error("OpenRouter API key is not configured");
            }
            onStatus?.(`${statusPrefix}: Resilience Hub...`);
            let lastErr: any = null;
            for (const [idx, model] of OPENROUTER_RESCUE_MODELS.entries()) {
                try {
                    const modelLabel = model.split('/')[1]?.split(':')[0] || model;
                    onStatus?.(`${statusPrefix} [Rescue ${idx + 1}/5]: ${modelLabel}...`);
                    return await withTimeout(
                        generateWithUniversal(openRouterKey, currentPrompt, poDb, "https://openrouter.ai/api/v1/chat/completions", model),
                        DEEP_TIMEOUT,
                        model
                    );
                } catch (err: any) {
                    lastErr = err;
                    const isQuota = err.message?.includes("429");
                    console.warn(`[Resilience Hub] OR Node ${model} failed:`, err.message || err);
                    await sleep(isQuota ? 15000 : 3000); // Wait longer if rate limited
                }
            }
            throw lastErr || new Error("All backup providers exhausted.");
        };

        const runSambaNovaTier = async (retryCount = 0): Promise<any> => {
            if (!sambaNovaKey || sambaNovaKey.length < 5) return await runOpenRouterRescue();
            try {
                onStatus?.(`${statusPrefix}: SambaNova Tier...`);
                return await withTimeout(
                    generateWithUniversal(sambaNovaKey, currentPrompt, poDb, "https://api.sambanova.ai/v1/chat/completions", "Meta-Llama-3.3-70B-Instruct"),
                    DEEP_TIMEOUT,
                    "SambaNova"
                );
            } catch (err: any) {
                const isQuota = err.message?.includes("429");
                if (isQuota && retryCount < 2) {  // Increased retries to 2
                    onStatus?.(`${statusPrefix}: Rate limited. Cooling down...`);
                    await sleep(20000);  // Increased cooldown to 20s
                    return await runSambaNovaTier(retryCount + 1);
                }
                console.error("[Resilience Hub] SambaNova Tier failed:", err.message || err);
                return await runOpenRouterRescue();
            }
        };

        const runGroqTier = async (retryCount = 0): Promise<any> => {
            if (!groqKey || groqKey.length < 5) return await runSambaNovaTier();
            try {
                onStatus?.(`${statusPrefix}: AI Hub (Groq)...`);
                const groq = new Groq({ apiKey: groqKey, dangerouslyAllowBrowser: true });
                const completion = await withTimeout(
                    groq.chat.completions.create({
                        messages: [{ role: "user", content: currentPrompt }],
                        model: "llama-3.3-70b-versatile",
                        temperature: 0,
                        response_format: { type: "json_object" }
                    }),
                    FAST_TIMEOUT,
                    "Groq"
                );
                return JSON.parse(completion.choices[0].message.content || "{}");
            } catch (err: any) {
                const isQuota = err.message?.includes("429");
                if (isQuota && retryCount < 1) {
                    onStatus?.(`${statusPrefix}: Groq Busy. Cooling down...`);
                    await sleep(10000);
                    return await runGroqTier(retryCount + 1);
                }
                console.warn(`[Resilience Hub] Groq failed:`, err.message || err);
                return await runSambaNovaTier();
            }
        };

        if (provider === "sambanova") return await runSambaNovaTier();
        if (provider === "openrouter") return await runOpenRouterRescue();
        return await runGroqTier();
    };

    try {
        // STEP 1: Discovery
        onStatus?.("Discovery: Analyzing syllabus structure...");
        const discovery = await executeResilientAI(getDiscoveryPrompt(syllabusText, poDb), "Discovery");
        
        // STEP 2: Sequential Unit Planning
        const allLectures: any[] = [];
        let currentLectureOffset = 1;

        if (discovery.units && Array.isArray(discovery.units)) {
            for (const unit of discovery.units) {
                // ADD COOLDOWN BETWEEN UNITS TO PREVENT 429
                if (allLectures.length > 0) {
                    onStatus?.(`Spacing requests (Respecting API limits)...`);
                    await new Promise(r => setTimeout(r, 6000));  // Increased to 6s
                }

                onStatus?.(`Planning: Unit ${unit.unitNo} (${unit.hours} Hours)...`);
                
                const unitPrompt = getUnitPlanningPrompt(unit, discovery.courseOutcomes, poDb);
                const unitResult = await executeResilientAI(unitPrompt, `Unit ${unit.unitNo}`);
                
                const lectures = Array.isArray(unitResult) ? unitResult : (unitResult.lectures || []);
                
                lectures.forEach((l: any) => {
                    allLectures.push({
                        ...l,
                        lectureNo: currentLectureOffset++,
                        unit: unit.unitNo.toString()
                    });
                });
            }
        }

        // STEP 3: Synthesis & Finalization
        onStatus?.("Synthesis: Finalizing accreditation data...");
        const mergedData = {
            ...discovery,
            lectures: allLectures
        };

        return finalizeMappingData(mergedData, poDb);

    } catch (error: any) {
        console.error("FATAL: All Resilience Systems are down:", error);
        throw new Error(`⚠️ System Overloaded. Details: ${error.message || "Unknown Failure"}`);
    }
};

