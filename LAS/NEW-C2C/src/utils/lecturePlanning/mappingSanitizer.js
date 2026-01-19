/**
 * RESTORES GOD-TIER ACCURACY (Step 1452 + 1708)
 * Ensures consistent data structure across all AI providers.
 */
export const finalizeMappingData = (parsed, poDb) => {
    // Audit POs to 12 as per user's earlier requirement for exhaustive mapping
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
            totalHours: Number(parsed.subject?.totalHours) ||
                (Number(parsed.subject?.theoryHours || 0) + Number(parsed.subject?.practicalHours || 0) + Number(parsed.subject?.pblHours || 0)),
            theoryHours: Number(parsed.subject?.theoryHours) || 0,
            practicalHours: Number(parsed.subject?.practicalHours) || 0,
            pblHours: Number(parsed.subject?.pblHours) || 0
        },
        courseOutcomes: (Array.isArray(parsed.courseOutcomes) ? parsed.courseOutcomes : []).map((co) => ({
            ...co,
            hours: Number(co.hours) || 0
        })),
        programOutcomes: validPOs,
        lectures: (Array.isArray(parsed.lectures) ? parsed.lectures : []).map((l, i) => ({
            ...l,
            lectureNo: Number(l.lectureNo) || (i + 1),
            hours: 1,
            co: l.co || "CO1",
            pos: Array.isArray(l.pos) ? l.pos : []
        })),
        practicals: (Array.isArray(parsed.practicals) ? parsed.practicals : []).map((p, i) => ({
            ...p,
            practicalNo: p.practicalNo || (i + 1).toString(),
            hours: Number(p.hours) || 2,
            mappedCOs: Array.isArray(p.mappedCOs) ? p.mappedCOs : [],
            mappedPOs: Array.isArray(p.mappedPOs) ? p.mappedPOs : [],
            assessment: p.assessment || "N/A"
        })),
        pblActivities: (Array.isArray(parsed.pblActivities) ? parsed.pblActivities : []).map((pbl, i) => ({
            ...pbl,
            activityNo: pbl.activityNo || `A${i + 1}`,
            hours: Number(pbl.hours) || 1,
            mappedCOs: Array.isArray(pbl.mappedCOs) ? pbl.mappedCOs : [],
            mappedPOs: Array.isArray(pbl.mappedPOs) ? pbl.mappedPOs : [],
            assessment: pbl.assessment || "N/A"
        })),
        coPoMapping: parsed.coPoMapping || {},
        justifications: parsed.justifications || {}
    };
};