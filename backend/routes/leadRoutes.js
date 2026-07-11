import express from 'express';
import { body } from 'express-validator';

// Controllers & Middlewares
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats,
  searchLeads,
} from '../controllers/leadController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Apply protect middleware to ALL routes in this file
router.use(protect);

// Predefined lists of valid statuses and sources matching schema constraints
const VALID_STATUSES = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
const VALID_SOURCES = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];

/**
 * Validation rules for creating a new lead.
 */
const createLeadValidation = [
  body('name')
    .notEmpty()
    .withMessage('Lead name is required')
    .isLength({ min: 2 })
    .withMessage('Lead name must be at least 2 characters long')
    .trim(),
  body('company')
    .notEmpty()
    .withMessage('Company name is required')
    .trim(),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(VALID_STATUSES)
    .withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),
  body('source')
    .optional()
    .isIn(VALID_SOURCES)
    .withMessage(`Source must be one of: ${VALID_SOURCES.join(', ')}`),
  body('value')
    .optional()
    .isNumeric()
    .withMessage('Lead value must be a number')
    .toFloat(),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
    .trim(),
];

/**
 * Validation rules for updating a lead.
 */
const updateLeadValidation = [
  body('name')
    .optional()
    .isLength({ min: 2 })
    .withMessage('Lead name must be at least 2 characters long')
    .trim(),
  body('company')
    .optional()
    .trim(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(VALID_STATUSES)
    .withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),
  body('source')
    .optional()
    .isIn(VALID_SOURCES)
    .withMessage(`Source must be one of: ${VALID_SOURCES.join(', ')}`),
  body('value')
    .optional()
    .isNumeric()
    .withMessage('Lead value must be a number')
    .toFloat(),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
    .trim(),
];

/**
 * Validation rules for status update endpoint.
 */
const updateStatusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(VALID_STATUSES)
    .withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),
];

// --- Lead CRUD Route Bindings ---

// 1. GET /api/leads/stats (Get aggregated dashboard statistics)
// NOTE: Defined BEFORE /:id to prevent matching stats as an ID parameter.
router.get('/stats', getLeadStats);

// 2. GET /api/leads/monthly-stats (Get monthly volume aggregates for past 6 months)
// NOTE: Defined BEFORE /:id to prevent matching monthly-stats as an ID parameter.
router.get('/monthly-stats', getMonthlyStats);

// 3. GET /api/leads/search (Quick search autocomplete)
// NOTE: Defined BEFORE /:id to prevent matching search as an ID parameter.
router.get('/search', searchLeads);

// 4. GET /api/leads (Get all leads with search/filter/pagination)
router.get('/', getLeads);

// 4. POST /api/leads (Create a new lead)
router.post('/', validate(createLeadValidation), createLead);

// 5. GET /api/leads/:id (Get single lead details)
router.get('/:id', getLeadById);

// 6. PUT /api/leads/:id (Update lead details)
router.put('/:id', validate(updateLeadValidation), updateLead);

// 7. PATCH /api/leads/:id/status (Modify lead status only)
router.patch('/:id/status', validate(updateStatusValidation), updateLeadStatus);

// 8. DELETE /api/leads/:id (Remove lead document)
router.delete('/:id', deleteLead);

export default router;
