const reportService = require('../services/report.service');

exports.conversionRate = async (req, res, next) => {
  try {
    const data = await reportService.conversionRate();
    res.success('Conversion rate', data);
  } catch (err) {
    next(err);
  }
};

exports.sourcePerformance = async (req, res, next) => {
  try {
    const data = await reportService.sourcePerformance();
    res.success('Source performance', data);
  } catch (err) {
    next(err);
  }
};

exports.dateRange = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const data = await reportService.dateRange(start, end);
    res.success('Date range report', data);
  } catch (err) {
    next(err);
  }
};
