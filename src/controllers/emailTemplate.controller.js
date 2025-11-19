const emailTemplateService = require('../services/emailTemplate.service');

exports.createTemplate = async (req, res, next) => {
  try {
    const tpl = await emailTemplateService.create(req.body);
    res.success('Template created', tpl);
  } catch (err) {
    next(err);
  }
};

exports.getTemplates = async (req, res, next) => {
  try {
    const tpls = await emailTemplateService.list();
    res.success('Templates fetched', tpls);
  } catch (err) {
    next(err);
  }
};

exports.updateTemplate = async (req, res, next) => {
  try {
    const tpl = await emailTemplateService.update(req.params.id, req.body);
    res.success('Template updated', tpl);
  } catch (err) {
    next(err);
  }
};

exports.deleteTemplate = async (req, res, next) => {
  try {
    await emailTemplateService.remove(req.params.id);
    res.success('Template deleted');
  } catch (err) {
    next(err);
  }
};
