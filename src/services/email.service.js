const nodemailer = require('nodemailer');
const EmailTemplate = require('../models/emailTemplate.model');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.send = async (to, subject, html) => {
  const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    html
  });
  return info;
};

exports.sendSimpleEmail = async (to, subject, text) => {
  const info = await transporter.sendMail({ from: process.env.FROM_EMAIL, to, subject, text });
  return info;
};

exports.sendTemplate = async (templateName, to, variables = {}) => {
  const tpl = await EmailTemplate.findOne({ name: templateName });
  if (!tpl) throw new Error('Template not found');
  let body = tpl.body;
  Object.keys(variables).forEach(k => {
    const re = new RegExp(`{{\s*${k}\s*}}`, 'g');
    body = body.replace(re, variables[k]);
  });
  return exports.send(to, tpl.subject, body);
};
