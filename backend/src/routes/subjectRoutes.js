import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  getSubjectStats,
} from '../controllers/subjectController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/subjects
 * @desc    Create a new subject/course
 * @access  FACULTY, HOD, ADMIN
 */
router.post('/', authorize('FACULTY', 'HOD', 'ADMIN'), createSubject);

/**
 * @route   GET /api/subjects
 * @desc    Get all subjects with optional filters
 * @access  FACULTY, STUDENT, HOD, ADMIN
 */
router.get('/', getAllSubjects);

/**
 * @route   GET /api/subjects/stats
 * @desc    Get subject statistics
 * @access  FACULTY, HOD, ADMIN
 */
router.get('/stats', authorize('FACULTY', 'HOD', 'ADMIN'), getSubjectStats);

/**
 * @route   GET /api/subjects/:id
 * @desc    Get a single subject by ID
 * @access  FACULTY, STUDENT, HOD, ADMIN
 */
router.get('/:id', getSubjectById);

/**
 * @route   PUT /api/subjects/:id
 * @desc    Update a subject
 * @access  FACULTY, HOD, ADMIN
 */
router.put('/:id', authorize('FACULTY', 'HOD', 'ADMIN'), updateSubject);

/**
 * @route   DELETE /api/subjects/:id
 * @desc    Delete a subject
 * @access  FACULTY, HOD, ADMIN
 */
router.delete('/:id', authorize('FACULTY', 'HOD', 'ADMIN'), deleteSubject);
 /**
 * @route   DELETE /api/subjects/:id
 * @desc    Delete a subject
 * @access  HOD, ADMIN
 */
router.delete('/:id', authorize('HOD', 'ADMIN'), deleteSubject);

export default router;
