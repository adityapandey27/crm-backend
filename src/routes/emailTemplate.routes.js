const express = require('express');
const router = express.Router();
const emailTemplateController = require('../controllers/emailTemplate.controller');
const auth = require('../middleware/auth.middleware');

router.use(auth.auth);

router.post('/', emailTemplateController.createTemplate);
router.get('/', emailTemplateController.getTemplates);
router.put('/:id', emailTemplateController.updateTemplate);
router.delete('/:id', emailTemplateController.deleteTemplate);

module.exports = router;
