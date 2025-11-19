const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware.auth);

router.post('/', appointmentController.createAppointment);
router.get('/:leadId/current', appointmentController.getCurrentAppointment);
router.get('/:leadId/history', appointmentController.getAppointmentHistory);
router.put('/:id', appointmentController.updateAppointment);
router.delete('/:id', appointmentController.deleteAppointment);
router.put('/:id/mark-done', appointmentController.markDone);

router.get('/today', appointmentController.todayFollowups);

router.get('/', appointmentController.getAllAppointments);

router.get('/calendar', appointmentController.getCalendar);









module.exports = router;
