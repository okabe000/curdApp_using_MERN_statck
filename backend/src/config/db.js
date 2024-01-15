const mongoose = require('mongoose');
const debug = require('debug')('app:database');

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        debug('Database connected successfully');
    } catch (error) {
        debug('Database connection error:', error);
        throw error; // Rethrow to handle it outside (optional)
    }
};

module.exports = connectDatabase;
