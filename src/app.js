const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const response = require('./utils/response');
const errorHandler = require('./middleware/error.middleware');

const authRoutes = require('./routes/auth.routes');
const leadRoutes = require('./routes/lead.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const emailTemplateRoutes = require('./routes/emailTemplate.routes');
const reportRoutes = require('./routes/report.routes');

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(morgan('dev'));


app.get("/", function (_, res) {
  res.statusCode = 200;
  res.json({ status: "success", message: "Parcel Pending API", data: {} });
});


// attach a helper for consistent responses
app.use((req, res, next) => {
  res.success = (message, data = {}) => response.success(res, message, data);
  res.error = (message, status = 400, data = {}) => response.error(res, message, status, data);
  next();
});


// routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/email-templates', emailTemplateRoutes);
app.use('/api/reports', reportRoutes);

// health
app.get('/api/health', (req, res) => res.success('ok', { time: new Date() }));

// error handler (should be last)
app.use(errorHandler);

module.exports = app;
