const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const auth = require('../middleware/auth.middleware');

router.use(auth.auth);

router.get('/conversion-rate', reportController.conversionRate);
router.get('/source-performance', reportController.sourcePerformance);
router.get('/date-range', reportController.dateRange);

module.exports = router;
