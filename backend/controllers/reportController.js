import asyncHandler from '../middleware/asyncHandler.js';
import Report from '../models/reportModel.js';

// @desc    Get all reports
// @route   GET /api/reports
// @access  Admin
export const getAllReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({})
    .populate('reported', 'name email')
    .populate('reporter', 'name email');
  res.status(200).json(reports);
});

// @desc    Create a report
// @route   POST /api/reports
// @access  Private
export const createReport = asyncHandler(async (req, res) => {
  const { message, reporter, reported } = req.body;
  const report = await Report.create({ reporter, reported, message });
  res.status(201).json(report);
});
