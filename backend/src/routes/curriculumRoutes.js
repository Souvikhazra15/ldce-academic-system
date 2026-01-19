import express from 'express';
import prisma from '../config/database.js';

const router = express.Router();

// Helper function to get or create program and subject
async function getOrCreateProgramAndSubject(subjectCode, subjectName, semesterNumber) {
  try {
    // Try to find existing subject by code
    let subject = await prisma.subject.findUnique({
      where: { code: subjectCode }
    });

    // If subject doesn't exist, create it
    if (!subject) {
      subject = await prisma.subject.create({
        data: {
          code: subjectCode,
          name: subjectName || `Subject ${subjectCode}`,
          credits: 3,
          isElective: false
        }
      });
      console.log('Created new subject:', subject.id);
    }

    // Try to find a department (use first one or create)
    let department = await prisma.department.findFirst();
    
    if (!department) {
      department = await prisma.department.create({
        data: {
          name: 'Computer Engineering',
          code: '07'
        }
      });
      console.log('Created new department:', department.id);
    }

    // Try to find a program (use first one or create)
    let program = await prisma.program.findFirst({
      where: { departmentId: department.id }
    });

    if (!program) {
      program = await prisma.program.create({
        data: {
          departmentId: department.id,
          name: 'B.E. Computer Engineering',
          totalSemesters: 8
        }
      });
      console.log('Created new program:', program.id);
    }

    return { programId: program.id, subjectId: subject.id };
  } catch (error) {
    console.error('Error in getOrCreateProgramAndSubject:', error);
    throw error;
  }
}

// Save or update curriculum mapping with AI analysis data
router.post('/curriculum-mapping', async (req, res) => {
  try {
    const {
      programId,
      subjectId,
      semesterNumber,
      subjectCode,
      subjectName,
      courseOutcomes,
      programOutcomes,
      coPoMapping,
      lectures,
      practicals,
      pblActivities
    } = req.body;

    // Validate required fields
    if (!semesterNumber) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: semesterNumber'
      });
    }

    // If programId and subjectId are not provided or are defaults, try to get/create them
    let finalProgramId = programId;
    let finalSubjectId = subjectId;

    if (!programId || programId === 'default-program-id' || !subjectId || subjectId === 'default-subject-id') {
      if (!subjectCode) {
        return res.status(400).json({
          success: false,
          message: 'Missing required field: subjectCode (needed when programId or subjectId are not provided)'
        });
      }

      const { programId: newProgramId, subjectId: newSubjectId } = await getOrCreateProgramAndSubject(
        subjectCode,
        subjectName,
        semesterNumber
      );
      
      finalProgramId = newProgramId;
      finalSubjectId = newSubjectId;
    }

    // Check if mapping already exists
    const existingMapping = await prisma.curriculumMapping.findUnique({
      where: {
        programId_subjectId_semesterNumber: {
          programId: finalProgramId,
          subjectId: finalSubjectId,
          semesterNumber
        }
      }
    });

    const mappingData = {
      programId: finalProgramId,
      subjectId: finalSubjectId,
      semesterNumber,
      courseOutcomes: courseOutcomes || null,
      programOutcomes: programOutcomes || null,
      coPoMapping: coPoMapping || null,
      lectures: lectures || null,
      practicals: practicals || null,
      pblActivities: pblActivities || null
    };

    let result;
    if (existingMapping) {
      // Update existing mapping
      result = await prisma.curriculumMapping.update({
        where: {
          id: existingMapping.id
        },
        data: mappingData
      });
    } else {
      // Create new mapping
      result = await prisma.curriculumMapping.create({
        data: mappingData
      });
    }

    res.json({
      success: true,
      message: existingMapping ? 'Curriculum mapping updated successfully' : 'Curriculum mapping saved successfully',
      data: result
    });

  } catch (error) {
    console.error('Error saving curriculum mapping:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save curriculum mapping',
      error: error.message
    });
  }
});

// Get curriculum mapping by program, subject, and semester
router.get('/curriculum-mapping/:programId/:subjectId/:semesterNumber', async (req, res) => {
  try {
    const { programId, subjectId, semesterNumber } = req.params;

    const mapping = await prisma.curriculumMapping.findUnique({
      where: {
        programId_subjectId_semesterNumber: {
          programId,
          subjectId,
          semesterNumber: parseInt(semesterNumber)
        }
      }
    });

    if (!mapping) {
      return res.status(404).json({
        success: false,
        message: 'Curriculum mapping not found'
      });
    }

    res.json({
      success: true,
      data: mapping
    });

  } catch (error) {
    console.error('Error fetching curriculum mapping:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch curriculum mapping',
      error: error.message
    });
  }
});

export default router;
