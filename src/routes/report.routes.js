const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const auth = require('../middleware/auth.middleware');

router.use(auth.auth);

// existing
router.get('/conversion-rate', reportController.conversionRate);
router.get('/source-performance', reportController.sourcePerformance);
router.get('/date-range', reportController.dateRange);

// NEW endpoints
router.get('/leads-weekly', reportController.leadsWeekly);            // daily counts in range
router.get('/leads-by-stage', reportController.leadsByStage);         // counts by stage
router.get('/conversion-trend', reportController.conversionTrend);    // monthly conversion trend
router.get('/upcoming-followups', reportController.upcomingFollowups); // upcoming appointments

module.exports = router;
