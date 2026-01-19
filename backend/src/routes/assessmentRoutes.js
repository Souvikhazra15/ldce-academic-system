import express from 'express';
import prisma from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Health check - test endpoint without auth
router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Assessment API is running' });
});

// Save assessment as draft
router.post('/save-draft', authenticate, async (req, res) => {
  try {
    const { courseId, assessmentSubType, studentMarksData, coAttainmentData } = req.body;

    if (!courseId || !assessmentSubType) {
      return res.status(400).json({ 
        error: 'Missing required fields: courseId and assessmentSubType are required',
        received: { courseId, assessmentSubType }
      });
    }

    // Try to find existing subject, if not found create a temporary one
    let subject = await prisma.subject.findUnique({
      where: { id: courseId }
    });

    if (!subject) {
      // For now, try to find by code (in case courseId is actually a code)
      subject = await prisma.subject.findUnique({
        where: { code: courseId }
      });
    }

    if (!subject) {
      // Create a temporary subject if it doesn't exist
      console.warn(`Subject with ID ${courseId} not found. Creating temporary subject.`);
      subject = await prisma.subject.create({
        data: {
          id: courseId,
          name: `Course ${courseId}`,
          code: courseId,
          credits: 3
        }
      });
    }

    // Create assessment with only the fields in the simplified schema
    const assessment = await prisma.assessment.create({
      data: {
        subjectId: subject.id,
        assessmentSubType: assessmentSubType,
        studentMarksData: studentMarksData || [],
        coAttainmentData: coAttainmentData || {}
      }
    });

    res.status(201).json({
      success: true,
      message: 'Assessment saved as draft',
      data: assessment
    });
  } catch (error) {
    console.error('Error saving draft:', error);
    res.status(500).json({ 
      error: 'Failed to save assessment',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Submit assessment
router.post('/submit', authenticate, async (req, res) => {
  try {
    const { courseId, assessmentSubType, studentMarksData, coAttainmentData } = req.body;

    if (!courseId || !assessmentSubType) {
      return res.status(400).json({ 
        error: 'Missing required fields: courseId and assessmentSubType are required',
        received: { courseId, assessmentSubType }
      });
    }

    // Try to find existing subject, if not found create a temporary one
    let subject = await prisma.subject.findUnique({
      where: { id: courseId }
    });

    if (!subject) {
      // For now, try to find by code (in case courseId is actually a code)
      subject = await prisma.subject.findUnique({
        where: { code: courseId }
      });
    }

    if (!subject) {
      // Create a temporary subject if it doesn't exist
      console.warn(`Subject with ID ${courseId} not found. Creating temporary subject.`);
      subject = await prisma.subject.create({
        data: {
          id: courseId,
          name: `Course ${courseId}`,
          code: courseId,
          credits: 3
        }
      });
    }

    // Create assessment (submitted version) with only the fields in the simplified schema
    const assessment = await prisma.assessment.create({
      data: {
        subjectId: subject.id,
        assessmentSubType: assessmentSubType,
        studentMarksData: studentMarksData || [],
        coAttainmentData: coAttainmentData || {}
      }
    });

    res.status(201).json({
      success: true,
      message: 'Assessment submitted successfully',
      data: assessment
    });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    res.status(500).json({ 
      error: 'Failed to submit assessment',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get assessment by ID
router.get('/:assessmentId', authenticate, async (req, res) => {
  try {
    const { assessmentId } = req.params;

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId }
    });

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    res.status(200).json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Error fetching assessment:', error);
    res.status(500).json({ 
      error: 'Failed to fetch assessment',
      details: error.message 
    });
  }
});

// Get all assessments for a subject
router.get('/subject/:subjectId', authenticate, async (req, res) => {
  try {
    const { subjectId } = req.params;

    const assessments = await prisma.assessment.findMany({
      where: { subjectId: subjectId },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      count: assessments.length,
      data: assessments
    });
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ 
      error: 'Failed to fetch assessments',
      details: error.message 
    });
  }
});

// Update assessment
router.put('/:assessmentId', authenticate, async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { studentMarksData, coThresholds, isDraft, assessmentSubType, maxMarks } = req.body;

    const assessment = await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        studentMarksData: studentMarksData,
        coThresholds: coThresholds,
        isDraft: isDraft,
        assessmentSubType: assessmentSubType,
        maxMarks: maxMarks
      }
    });

    res.status(200).json({
      success: true,
      message: 'Assessment updated successfully',
      data: assessment
    });
  } catch (error) {
    console.error('Error updating assessment:', error);
    res.status(500).json({ 
      error: 'Failed to update assessment',
      details: error.message 
    });
  }
});

// Delete assessment
router.delete('/:assessmentId', authenticate, async (req, res) => {
  try {
    const { assessmentId } = req.params;

    await prisma.assessment.delete({
      where: { id: assessmentId }
    });

    res.status(200).json({
      success: true,
      message: 'Assessment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    res.status(500).json({ 
      error: 'Failed to delete assessment',
      details: error.message 
    });
  }
});

export default router;
