require('dotenv').config();

const createApp = require('./app');
const connectDB = require('./db');

const PORT = process.env.PORT || 5000;
const app = createApp();

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Backend API listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
