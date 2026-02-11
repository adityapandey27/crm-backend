const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose"); // 1. Added missing import
const response = require("./src/utils/response");
const errorHandler = require("./src/middleware/error.middleware");
const authRoutes = require("./src/routes/auth.routes");
const leadRoutes = require("./src/routes/lead.routes");
const appointmentRoutes = require("./src/routes/appointment.routes");
const emailTemplateRoutes = require("./src/routes/emailTemplate.routes");
const reportRoutes = require("./src/routes/report.routes");

require("dotenv").config();

const app = express();

// --- DATABASE CONNECTION LOGIC ---
let isConnected = false;

const connectDB = async () => {
  mongoose.set('strictQuery', true);
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    // Don't throw here, or the whole app crashes on one failed request
  }
};

// --- MIDDLEWARE ---
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(morgan("dev"));

// Database Connection Middleware (Crucial for Vercel)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Helper for consistent responses
app.use((req, res, next) => {
  res.success = (message, data = {}) => response.success(res, message, data);
  res.error = (message, status = 400, data = {}) => response.error(res, message, status, data);
  next();
});

// --- ROUTES ---
app.get("/", (req, res) => {
  res.json({ status: "success", message: "Parcel Pending API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/email-templates", emailTemplateRoutes);
app.use("/api/report", reportRoutes);
app.get("/api/health", (req, res) => res.success("ok", { time: new Date() }));

// Error Handler
app.use(errorHandler);

// --- EXPORTS ---
// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// For Vercel
module.exports = app;