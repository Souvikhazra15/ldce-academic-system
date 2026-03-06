import prisma from '../config/database.js';

/**
 * Create a new subject/course
 * @access FACULTY, HOD, ADMIN
 */
export const createSubject = async (req, res) => {
  try {
    const { name, code, credits, isElective } = req.body;

    // Validate required fields
    if (!name || !code || credits === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, code, and credits are required fields',
      });
    }

    // Validate credits is a positive number
    if (typeof credits !== 'number' || credits <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Credits must be a positive number',
      });
    }

    // Check if subject with same code already exists
    const existingSubject = await prisma.subject.findUnique({
      where: { code },
    });

    if (existingSubject) {
      return res.status(409).json({
        success: false,
        message: `Subject with code "${code}" already exists`,
      });
    }

    // Create the subject
    const subject = await prisma.subject.create({
      data: {
        name,
        code,
        credits,
        isElective: isElective || false,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: subject,
    });
  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subject',
      error: error.message,
    });
  }
};

/**
 * Get all subjects/courses with optional filters
 * @access FACULTY, STUDENT, HOD, ADMIN
 */
export const getAllSubjects = async (req, res) => {
  try {
    const { isElective, search, page = 1, limit = 50 } = req.query;

    // Build filter conditions
    const where = {};

    if (isElective !== undefined) {
      where.isElective = isElective === 'true';
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Get subjects with count
    const [subjects, total] = await Promise.all([
      prisma.subject.findMany({
        where,
        skip,
        take,
        orderBy: [
          { code: 'asc' },
        ],
        include: {
          _count: {
            select: {
              curriculumMappings: true,
              courseOutcomes: true,
              assessments: true,
            },
          },
        },
      }),
      prisma.subject.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        subjects,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subjects',
      error: error.message,
    });
  }
};

/**
 * Get a single subject by ID
 * @access FACULTY, STUDENT, HOD, ADMIN
 */
export const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        curriculumMappings: {
          include: {
            program: {
              select: {
                id: true,
                name: true,
                department: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        courseOutcomes: {
          select: {
            id: true,
            description: true,
            rbtLevel: true,
          },
        },
        _count: {
          select: {
            lecturePlans: true,
            assessments: true,
            attendanceSessions: true,
          },
        },
      },
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    res.status(200).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    console.error('Get subject by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subject',
      error: error.message,
    });
  }
};

/**
 * Update a subject
 * @access FACULTY, HOD, ADMIN
 */
export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, credits, isElective } = req.body;

    // Check if subject exists
    const existingSubject = await prisma.subject.findUnique({
      where: { id },
    });

    if (!existingSubject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    // If code is being updated, check if new code is already in use
    if (code && code !== existingSubject.code) {
      const codeInUse = await prisma.subject.findUnique({
        where: { code },
      });

      if (codeInUse) {
        return res.status(409).json({
          success: false,
          message: `Subject code "${code}" is already in use`,
        });
      }
    }

    // Validate credits if provided
    if (credits !== undefined && (typeof credits !== 'number' || credits <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Credits must be a positive number',
      });
    }

    // Update the subject
    const updatedSubject = await prisma.subject.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(code && { code }),
        ...(credits !== undefined && { credits }),
        ...(isElective !== undefined && { isElective }),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Subject updated successfully',
      data: updatedSubject,
    });
  } catch (error) {
    console.error('Update subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subject',
      error: error.message,
    });
  }
};

/**
 * Delete a subject
 * @access HOD, ADMIN
 */
export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if subject exists
    const subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            curriculumMappings: true,
            courseOutcomes: true,
            lecturePlans: true,
            assessments: true,
            attendanceSessions: true,
          },
        },
      },
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    // Check if subject has related data
    const hasRelatedData = Object.values(subject._count).some(count => count > 0);

    if (hasRelatedData) {
      return res.status(409).json({
        success: false,
        message: 'Cannot delete subject with existing curriculum mappings, course outcomes, lecture plans, assessments, or attendance sessions',
        relatedData: subject._count,
      });
    }

    // Delete the subject
    await prisma.subject.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully',
    });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete subject',
      error: error.message,
    });
  }
};

/**
 * Get subject statistics
 * @access FACULTY, HOD, ADMIN
 */
export const getSubjectStats = async (req, res) => {
  try {
    const [totalSubjects, electiveSubjects, coreSubjects] = await Promise.all([
      prisma.subject.count(),
      prisma.subject.count({ where: { isElective: true } }),
      prisma.subject.count({ where: { isElective: false } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalSubjects,
        elective: electiveSubjects,
        core: coreSubjects,
      },
    });
  } catch (error) {
    console.error('Get subject stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subject statistics',
      error: error.message,
    });
  }
};
