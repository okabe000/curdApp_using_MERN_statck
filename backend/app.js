const express = require('express');
const app = express();
const logger = require('./src/utils/logger');
const loggerMiddleware = require('./src/middleware/loggerMiddleware');


const userRoutes = require('./src/api/routes/users');
const itemRoutes = require('./src/api/routes/items');

// Other setup like middleware, database connection, etc.

// Use the user routes
app.use('/api/users', userRoutes);

// Use the item routes
app.use('/api/items', itemRoutes);

app.use(loggerMiddleware);

// Other routes and error handling

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
