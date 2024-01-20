const express = require('express');
const fs = require('fs'); // File system module, can be removed if not used elsewhere
const cors = require('cors');

const app = express();
const loggerMiddleware = require('./src/middleware/loggerMiddleware');
const userRoutes = require('./src/api/routes/users');
const itemRoutes = require('./src/api/routes/items');
const connectDatabase = require('./src/config/db');
const crypto = require('crypto');

// Other setup like middleware, routes, etc.
app.use(express.json());
app.use(cors());
app.use(loggerMiddleware);

const generateSecret = () => crypto.randomBytes(64).toString('hex');
const jwtSecret = generateSecret();
console.log('JWT Secret:', jwtSecret);

app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);

const startServer = async () => {
  const maxRetries = 5;
  const port = process.env.PORT || 3000;

  for (let i = 0; i < maxRetries; i++) {
    try {
      await connectDatabase();
      console.log('Database connection successful');

      // Starting an HTTP server
      app.listen(port, () => {
        console.log(`HTTP Server is running on port ${port}`);
      });
      return;
    } catch (error) {
      console.error(`Failed to connect to the database (attempt ${i + 1}):`, error);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.error('Could not connect to the database after several attempts. Exiting...');
  process.exit(1);
};

startServer();
