require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./config/database');
const { questionRoutes, categoryRoutes } = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const { htmlContent } = require('./utils/htmlContent');

mongoose.set('strictQuery', false);
mongoose.set('debug', process.env.NODE_ENV === 'development');
const app = express();
const port = process.env.PORT || 5005;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.type('html').send(htmlContent);
});

app.use('/api/questions', questionRoutes);
app.use('/api/categories', categoryRoutes);

// Error handling middleware
app.use(errorHandler);

// Server startup
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Backend server listening on port ${port}!`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
