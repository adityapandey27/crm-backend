const app = require('./app');
const connectDB = require('./config/db');
const cronJobs = require('./utils/cronJobs');
require('dotenv').config();

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    console.log("process.env.MONGO_URI=========",process.env.MONGO_URI)
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
