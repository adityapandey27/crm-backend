const express = require('express');
const router = express.Router();
const leadController = require('../controllers/lead.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware.auth);

router.post('/', leadController.createLead);
router.get('/', leadController.getLeads);
router.get('/search', leadController.searchLeads);
router.get('/:id', leadController.getLeadById);
router.put('/:id', leadController.updateLead);
router.delete('/:id', leadController.deleteLead);
router.put('/:id/stage', leadController.updateStage);
router.get('/:id/appointments', leadController.getLeadAppointments);
router.get('/today-followups', leadController.getTodayFollowups);

module.exports = router;
