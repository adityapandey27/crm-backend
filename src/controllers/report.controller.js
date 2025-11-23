const reportService = require('../services/report.service');

exports.conversionRate = async (req, res, next) => {
  try {
    const data = await reportService.conversionRate();
    res.success('Conversion rate', data);
  } catch (err) { next(err); }
};

exports.sourcePerformance = async (req, res, next) => {
  try {
    const data = await reportService.sourcePerformance();
    res.success('Source performance', data);
  } catch (err) { next(err); }
};

exports.dateRange = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const data = await reportService.dateRange(start, end);
    res.success('Date range report', data);
  } catch (err) { next(err); }
};
// NEW
exports.leadsWeekly = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const data = await reportService.leadsWeekly(start, end);
    res.success('Leads weekly', data);
  } catch (err) { next(err); }
};

exports.leadsByStage = async (req, res, next) => {
  try {
    const data = await reportService.leadsByStage();
    res.success('Leads by stage', data);
  } catch (err) { next(err); }
};

exports.conversionTrend = async (req, res, next) => {
  try {
    const data = await reportService.conversionTrend();
    res.success('Conversion trend', data);
  } catch (err) { next(err); }
};

exports.upcomingFollowups = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const data = await reportService.upcomingFollowups(days);
    res.success('Upcoming followups', data);
  } catch (err) { next(err); }
};
