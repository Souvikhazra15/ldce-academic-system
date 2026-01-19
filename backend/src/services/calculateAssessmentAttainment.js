const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// --- CONFIGURATION ---
const ATTAINMENT_LEVELS = [
  { level: 3, percentage: 80 },
  { level: 2, percentage: 70 },
  { level: 1, percentage: 60 },
  { level: 0, percentage: 0  }
];

async function calculateAssessmentAttainment(offeringId, assessmentId) {
  console.log(`\n--- Starting Attainment Calculation (Dynamic Thresholds) ---`);
  console.log(`Offering: ${offeringId}, Assessment: ${assessmentId}`);

  try {
    // ---------------------------------------------------------
    // STEP 1: Get Total Students (Denominator)
    // ---------------------------------------------------------
    const totalStudents = await prisma.student_Course_Registration.count({
      where: { offering_id: offeringId }
    });

    if (totalStudents === 0) {
      console.log("⚠️ No students registered for this offering. Aborting.");
      return [];
    }

    // ---------------------------------------------------------
    // STEP 2: Fetch CO Configs, Marks AND Course Outcome Details
    // ---------------------------------------------------------
    const coConfigs = await prisma.assessment_Config.findMany({
      where: { assessment_id: assessmentId },
      include: {
        Student_Mark: true,
        // Ensure the relation name 'Course_Outcome' matches your schema
        Course_Outcome: true 
      }
    });

    const results = [];

    // ---------------------------------------------------------
    // STEP 3: Calculation Loop
    // ---------------------------------------------------------
    for (const config of coConfigs) {
      const coId = config.co_id;
      const maxMarks = config.max_marks;

      if (maxMarks === 0) continue;

      // --- DYNAMIC THRESHOLD LOGIC ---
      let threshold = 0.40; // Default fallback
      
      if (config.Course_Outcome && config.Course_Outcome.pass_threshold !== undefined && config.Course_Outcome.pass_threshold !== null) {
         // Use the value from DB. (Assuming DB stores it as float 0.40. If int 40, divide by 100)
         threshold = config.Course_Outcome.pass_threshold; 
      }

      // A. Calculate Pass Mark
      const passMark = maxMarks * threshold;

      // B. Count students who passed
      let passedCount = 0;
      if (config.Student_Mark && config.Student_Mark.length > 0) {
        passedCount = config.Student_Mark.filter((record) => {
          return record.marks_obtained >= passMark;
        }).length;
      }

      // C. Calculate Class Percentage
      const attainmentPercentage = (passedCount / totalStudents) * 100;

      // D. Determine Attainment Level
      const levelFound = ATTAINMENT_LEVELS.find(
        (l) => attainmentPercentage >= l.percentage
      );
      const attainmentLevel = levelFound ? levelFound.level : 0;

      results.push({
        co_id: coId,
        max_marks: maxMarks,       // <--- 1. We added this so we can save it later
        pass_mark_threshold: passMark,
        used_threshold_ratio: threshold,
        total_students: totalStudents,
        students_passed: passedCount,
        attainment_percentage: attainmentPercentage.toFixed(2),
        attainment_level: attainmentLevel
      });
    }

    // ---------------------------------------------------------
    // STEP 4: Save (Upsert) to Database
    // ---------------------------------------------------------
    if (results.length > 0) {
      console.log(`Saving ${results.length} attainment records to DB...`);

      await prisma.$transaction(
        results.map((res) => 
          prisma.co_Attainment_Log.upsert({
            where: {
              offering_id_assessment_id_co_id: {
                offering_id: offeringId,
                assessment_id: assessmentId,
                co_id: res.co_id
              }
            },
            update: {
              max_marks: res.max_marks, // <--- 2. UPDATING max_marks
              total_students: res.total_students,
              students_passed: res.students_passed,
              attainment_percentage: parseFloat(res.attainment_percentage),
              attainment_level: res.attainment_level,
              calculated_at: new Date()
            },
            create: {
              offering_id: offeringId,
              assessment_id: assessmentId,
              co_id: res.co_id,
              max_marks: res.max_marks, // <--- 3. CREATING with max_marks
              total_students: res.total_students,
              students_passed: res.students_passed,
              attainment_percentage: parseFloat(res.attainment_percentage),
              attainment_level: res.attainment_level
            }
          })
        )
      );
      console.log("✅ Database updated successfully.");
    }

    return results;

  } catch (error) {
    console.error("❌ Error calculating attainment:", error);
    throw error;
  }
}

module.exports = { calculateAssessmentAttainment };