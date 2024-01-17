const express = require('express');
const cors = require('cors');
const app = express();
const logger = require('./src/utils/logger');
const loggerMiddleware = require('./src/middleware/loggerMiddleware');
const userRoutes = require('./src/api/routes/users');
const itemRoutes = require('./src/api/routes/items');

// Import the database connection function
const connectDatabase = require('./src/config/db');

// Other setup like middleware, routes, etc.
app.use(express.json());
app.use(cors());
app.use(loggerMiddleware);

// Use the user and item routes
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);

// Other routes and error handling

// Database connection and server startup
const startServer = async () => {
  const maxRetries = 5;
  const port = process.env.PORT || 3000;

  for (let i = 0; i < maxRetries; i++) {
    try {
      await connectDatabase();
      console.log('Database connection successful');
      app.listen(port, () => console.log(`Server is running on port ${port}`));
      return;
    } catch (error) {
      console.error(`Failed to connect to the database (attempt ${i + 1}):`, error);
      // Wait for 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.error('Could not connect to the database after several attempts. Exiting...');
  process.exit(1); // Exit the process with failure code
};

startServer();
