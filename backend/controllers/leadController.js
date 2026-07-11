import Lead from '../models/Lead.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Helper to log controller invocations in development mode.
 * 
 * @param {string} message - The log message context.
 * @param {any} [data] - Optional metadata to log.
 */
const devLog = (message, data = '') => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[LeadController] ${message}`, data);
  }
};

/**
 * Retrieve a paginated, filtered list of leads owned by the authenticated user.
 * 
 * INPUTS (Query params):
 * - page {Number} (default: 1, pagination page)
 * - limit {Number} (default: 20, items per page)
 * - sortBy {String} (default: 'createdAt', sorting field name)
 * - sortOrder {String} (default: 'desc', sorting order 'asc' or 'desc')
 * - status {String} (optional status filter, e.g. 'Won', 'Lost')
 * - source {String} (optional source filter, e.g. 'LinkedIn', 'Website')
 * - search {String} (optional search text across name, company, and email)
 * - dateFrom {String} (optional ISO date string for range filter, matches createdAt >= dateFrom)
 * - dateTo {String} (optional ISO date string for range filter, matches createdAt <= dateTo)
 * 
 * OUTPUTS:
 * - JSON response with page payload and pagination metadata.
 */
export const getLeads = async (req, res, next) => {
  devLog('getLeads invoked by user:', req.user._id);
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      source,
      search,
      dateFrom,
      dateTo,
    } = req.query;

    // Filter always scope-isolated to the authenticated user's leads
    const filter = { owner: req.user._id };

    // Apply status filter unless set to 'All'
    if (status && status !== 'All') {
      filter.status = status;
    }

    // Apply source filter
    if (source) {
      filter.source = source;
    }

    // Apply regex search on name, company, or email fields
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Apply date range filters on createdAt field if provided
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.createdAt.$lte = new Date(dateTo);
      }
    }

    // Parse pagination parameters
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skipVal = (pageNum - 1) * limitNum;

    // Build query sort object
    const sortObj = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Run query execution and countDocuments in parallel
    const [total, leads] = await Promise.all([
      Lead.countDocuments(filter),
      Lead.find(filter)
        .sort(sortObj)
        .skip(skipVal)
        .limit(limitNum),
    ]);

    const totalPages = Math.ceil(total / limitNum);
    const hasNext = pageNum < totalPages;
    const hasPrev = pageNum > 1;

    return res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: totalPages,
        hasNext,
        hasPrev,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Capture and store a new lead document.
 * 
 * INPUTS (Body):
 * - name {String} (required)
 * - company {String} (required)
 * - email {String} (required)
 * - phone {String} (optional)
 * - status {String} (default: 'New')
 * - source {String} (default: 'Website')
 * - value {Number} (default: 0)
 * - notes {String} (optional)
 * 
 * OUTPUTS:
 * - JSON successResponse with status code 201 containing the new lead.
 */
export const createLead = async (req, res, next) => {
  devLog('createLead invoked by user:', req.user._id);
  try {
    const { name, company, email, phone, status, source, value, notes } = req.body;

    const lead = await Lead.create({
      name,
      company,
      email,
      phone,
      status,
      source,
      value,
      notes,
      owner: req.user._id, // Enforce current authenticated user as owner
    });

    return successResponse(res, lead, 'Lead created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch detailed metrics for a single lead document by its ID.
 * 
 * INPUTS (Params):
 * - id {String} (Database Object ID of the lead)
 * 
 * OUTPUTS:
 * - JSON successResponse containing the lead document.
 */
export const getLeadById = async (req, res, next) => {
  devLog(`getLeadById invoked for ID: ${req.params.id} by user:`, req.user._id);
  try {
    // Find lead ensuring ownership matching
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
    
    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, lead, 'Lead retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Modify fields of an existing lead. Does not allow transferring ownership.
 * 
 * INPUTS (Params & Body):
 * - id {String} (Database Object ID of the lead)
 * - req.body fields to update
 * 
 * OUTPUTS:
 * - JSON successResponse containing the updated lead document.
 */
export const updateLead = async (req, res, next) => {
  devLog(`updateLead invoked for ID: ${req.params.id} by user:`, req.user._id);
  try {
    const updateData = { ...req.body };
    
    // Security: Do NOT allow changing the owner field under any circumstances
    delete updateData.owner;

    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, lead, 'Lead updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update pipeline lifecycle status of a lead in a single atomic database operation.
 * 
 * INPUTS (Params & Body):
 * - id {String} (Database Object ID of the lead)
 * - status {String} (required new status)
 * 
 * OUTPUTS:
 * - JSON successResponse containing updated lead.
 */
export const updateLeadStatus = async (req, res, next) => {
  devLog(`updateLeadStatus invoked for ID: ${req.params.id} by user:`, req.user._id);
  try {
    const { status } = req.body;

    const validStatuses = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
    if (!validStatuses.includes(status)) {
      return errorResponse(res, `Status must be one of: ${validStatuses.join(', ')}`, 400);
    }

    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, lead, 'Lead status updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Remove lead document from the database.
 * 
 * INPUTS (Params):
 * - id {String} (Database Object ID of the lead)
 * 
 * OUTPUTS:
 * - JSON response indicating delete success.
 */
export const deleteLead = async (req, res, next) => {
  devLog(`deleteLead invoked for ID: ${req.params.id} by user:`, req.user._id);
  try {
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
    
    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    await lead.deleteOne();

    return successResponse(res, null, 'Lead deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Autocomplete quick search for leads, returning only limited fields.
 * 
 * INPUTS (Query):
 * - q {String} (search query)
 * - limit {Number} (default: 5, maximum result limit)
 * 
 * OUTPUTS:
 * - JSON response with array of matching leads containing _id, name, company, email, status.
 */
export const searchLeads = async (req, res, next) => {
  devLog('searchLeads autocomplete query:', req.query.q);
  try {
    const { q, limit = 5 } = req.query;

    if (!q) {
      return successResponse(res, [], 'Search query is empty');
    }

    const regex = new RegExp(q, 'i');
    const limitNum = parseInt(limit, 10) || 5;

    const leads = await Lead.find({
      owner: req.user._id,
      $or: [
        { name: regex },
        { company: regex },
        { email: regex },
      ],
    })
      .select('_id name company email status')
      .limit(limitNum);

    return successResponse(res, leads, 'Search completed successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get cumulative statistics, source details, and growth rates of leads in a single database query.
 * 
 * INPUTS:
 * - req.user._id
 * 
 * OUTPUTS:
 * - JSON stats object containing totalLeads, statusBreakdown, conversionRate, sourceBreakdown, thisMonthLeads, lastMonthLeads, and growthRate.
 */
export const getLeadStats = async (req, res, next) => {
  devLog('getLeadStats invoked by user:', req.user._id);
  try {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const stats = await Lead.aggregate([
      // Scope aggregation to authenticated user
      { $match: { owner: req.user._id } },
      {
        $group: {
          _id: null,
          totalLeads: { $sum: 1 },
          
          // Status counts
          New: { $sum: { $cond: [{ $eq: ['$status', 'New'] }, 1, 0] } },
          Contacted: { $sum: { $cond: [{ $eq: ['$status', 'Contacted'] }, 1, 0] } },
          MeetingScheduled: { $sum: { $cond: [{ $eq: ['$status', 'Meeting Scheduled'] }, 1, 0] } },
          ProposalSent: { $sum: { $cond: [{ $eq: ['$status', 'Proposal Sent'] }, 1, 0] } },
          Won: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] } },
          Lost: { $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] } },

          // Source counts
          Website: { $sum: { $cond: [{ $eq: ['$source', 'Website'] }, 1, 0] } },
          Referral: { $sum: { $cond: [{ $eq: ['$source', 'Referral'] }, 1, 0] } },
          LinkedIn: { $sum: { $cond: [{ $eq: ['$source', 'LinkedIn'] }, 1, 0] } },
          ColdCall: { $sum: { $cond: [{ $eq: ['$source', 'Cold Call'] }, 1, 0] } },
          EmailCampaign: { $sum: { $cond: [{ $eq: ['$source', 'Email Campaign'] }, 1, 0] } },
          Other: { $sum: { $cond: [{ $eq: ['$source', 'Other'] }, 1, 0] } },

          // Calendar month counts
          thisMonthLeads: {
            $sum: {
              $cond: [
                { $gte: ['$createdAt', startOfThisMonth] },
                1,
                0
              ]
            }
          },
          lastMonthLeads: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ['$createdAt', startOfLastMonth] },
                    { $lte: ['$createdAt', endOfLastMonth] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Handle edge case: division by zero or no leads found
    if (stats.length === 0) {
      return successResponse(res, {
        totalLeads: 0,
        statusBreakdown: { 'New': 0, 'Contacted': 0, 'Meeting Scheduled': 0, 'Proposal Sent': 0, 'Won': 0, 'Lost': 0 },
        conversionRate: 0.0,
        sourceBreakdown: { 'Website': 0, 'Referral': 0, 'LinkedIn': 0, 'Cold Call': 0, 'Email Campaign': 0, 'Other': 0 },
        thisMonthLeads: 0,
        lastMonthLeads: 0,
        growthRate: 0.0
      }, 'Lead statistics retrieved successfully');
    }

    const s = stats[0];
    const totalLeads = s.totalLeads || 0;
    const won = s.Won || 0;
    
    // Calculate rounded conversion rate to 1 decimal place
    const conversionRate = totalLeads ? parseFloat(((won / totalLeads) * 100).toFixed(1)) : 0.0;
    
    const thisMonth = s.thisMonthLeads || 0;
    const lastMonth = s.lastMonthLeads || 0;
    
    // Calculate growth rate compared to last month (handling division by zero)
    let growthRate = 0.0;
    if (lastMonth > 0) {
      growthRate = parseFloat((((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1));
    } else if (thisMonth > 0) {
      growthRate = 100.0; // 100% growth if starting from 0
    }

    return successResponse(res, {
      totalLeads,
      statusBreakdown: {
        'New': s.New || 0,
        'Contacted': s.Contacted || 0,
        'Meeting Scheduled': s.MeetingScheduled || 0,
        'Proposal Sent': s.ProposalSent || 0,
        'Won': won,
        'Lost': s.Lost || 0
      },
      conversionRate,
      sourceBreakdown: {
        'Website': s.Website || 0,
        'Referral': s.Referral || 0,
        'LinkedIn': s.LinkedIn || 0,
        'Cold Call': s.ColdCall || 0,
        'Email Campaign': s.EmailCampaign || 0,
        'Other': s.Other || 0
      },
      thisMonthLeads: thisMonth,
      lastMonthLeads: lastMonth,
      growthRate
    }, 'Lead statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get monthly stats (volume, won counts, conversion rates) grouped chronologically for the last 6 months.
 * 
 * INPUTS:
 * - req.user._id
 * 
 * OUTPUTS:
 * - JSON stats list containing month (e.g. 'Jan 2025'), total, won, lost, and conversionRate.
 */
export const getMonthlyStats = async (req, res, next) => {
  devLog('getMonthlyStats aggregate invoked by user:', req.user._id);
  try {
    const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Target start date (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Set to first day to avoid issues with date shifting
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyData = await Lead.aggregate([
      {
        $match: {
          owner: req.user._id,
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: 1 },
          won: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] } },
          lost: { $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] } },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    // Build baseline timeline for exactly the last 6 months in chronological order
    const baseline = [];
    const dateCursor = new Date();
    dateCursor.setDate(1); // Start from first of the month

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(dateCursor.getMonth() - i);
      const mIndex = d.getMonth();
      const year = d.getFullYear();
      
      baseline.push({
        month: `${MONTHS_SHORT[mIndex]} ${year}`,
        year,
        monthNum: mIndex + 1, // Mongoose extracts 1-indexed months
        total: 0,
        won: 0,
        lost: 0,
        conversionRate: 0.0,
      });
    }

    // Merge database aggregation results with baseline timeline
    monthlyData.forEach((item) => {
      const match = baseline.find(
        (b) => b.monthNum === item._id.month && b.year === item._id.year
      );
      if (match) {
        match.total = item.total;
        match.won = item.won;
        match.lost = item.lost;
        match.conversionRate = item.total ? parseFloat(((item.won / item.total) * 100).toFixed(1)) : 0.0;
      }
    });

    // Cleanup and project desired structure
    const formattedStats = baseline.map(({ month, total, won, lost, conversionRate }) => ({
      month,
      total,
      won,
      lost,
      conversionRate,
    }));

    return successResponse(res, formattedStats, 'Monthly statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};
