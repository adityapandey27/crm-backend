const connectDB = require("./src/config/db");

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const response = require("./src/utils/response");
const errorHandler = require("./src/middleware/error.middleware");
const cronJobs = require('./src/utils/cronJobs');
const authRoutes = require("./src/routes/auth.routes");
const leadRoutes = require("./src/routes/lead.routes");
const appointmentRoutes = require("./src/routes/appointment.routes");
const emailTemplateRoutes = require("./src/routes/emailTemplate.routes");
const reportRoutes = require("./src/routes/report.routes");
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 4000;
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", function (_, res) {
  res.statusCode = 200;
  res.json({ status: "success", message: "Parcel Pending API", data: {} });
});



app.use(express.json());
app.use(morgan("dev"));

(async () => {
  try {
    
    await connectDB(process.env.MONGO_URI);

    // start cron jobs
    cronJobs.startAll();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
// cronJobs.startAll();
// await connectDB(process.env.MONGO_URI);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



// attach a helper for consistent responses
app.use((req, res, next) => {
  res.success = (message, data = {}) => response.success(res, message, data);
  res.error = (message, status = 400, data = {}) =>
    response.error(res, message, status, data);
  next();
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/email-templates", emailTemplateRoutes);
app.use("/api/report", reportRoutes);

// health
app.get("/api/health", (req, res) => res.success("ok", { time: new Date() }));

// error handler (should be last)
app.use(errorHandler);

module.exports = app;
